package com.example.backend.service;

import com.example.backend.dto.request.RecommendationRequest;
import com.example.backend.dto.response.RecommendationItemResponse;
import com.example.backend.dto.response.RecommendationResponse;
import com.example.backend.entity.Food;
import com.example.backend.entity.Location;
import com.example.backend.entity.Province;
import com.example.backend.entity.TourFood;
import com.example.backend.entity.TourLocation;
import com.example.backend.entity.TourProvince;
import com.example.backend.entity.TourTransport;
import com.example.backend.entity.TransportType;
import com.example.backend.entity.VirtualTour;
import com.example.backend.repository.FoodRepository;
import com.example.backend.repository.LocationRepository;
import com.example.backend.repository.ProvinceRepository;
import com.example.backend.repository.TourFoodRepository;
import com.example.backend.repository.TourLocationRepository;
import com.example.backend.repository.TourProvinceRepository;
import com.example.backend.repository.TourTransportRepository;
import com.example.backend.repository.TransportTypeRepository;
import com.example.backend.repository.VirtualTourRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private static final Pattern DAY_PATTERN = Pattern.compile("(\\d+)\\s*(ngay|n)", Pattern.CASE_INSENSITIVE);

    private static final int FACTOR_DIM = 12;
    private static final int TRAIN_EPOCHS = 260;
    private static final double LEARNING_RATE = 0.03;
    private static final double REGULARIZATION = 0.02;
    private static final double LEARNING_DECAY = 0.992;
    private static final long RANDOM_SEED = 42L;

    private final VirtualTourRepository virtualTourRepository;
    private final TourProvinceRepository tourProvinceRepository;
    private final TourLocationRepository tourLocationRepository;
    private final TourFoodRepository tourFoodRepository;
    private final TourTransportRepository tourTransportRepository;
    private final ProvinceRepository provinceRepository;
    private final LocationRepository locationRepository;
    private final FoodRepository foodRepository;
    private final TransportTypeRepository transportTypeRepository;

    public RecommendationService(VirtualTourRepository virtualTourRepository,
                                 TourProvinceRepository tourProvinceRepository,
                                 TourLocationRepository tourLocationRepository,
                                 TourFoodRepository tourFoodRepository,
                                 TourTransportRepository tourTransportRepository,
                                 ProvinceRepository provinceRepository,
                                 LocationRepository locationRepository,
                                 FoodRepository foodRepository,
                                 TransportTypeRepository transportTypeRepository) {
        this.virtualTourRepository = virtualTourRepository;
        this.tourProvinceRepository = tourProvinceRepository;
        this.tourLocationRepository = tourLocationRepository;
        this.tourFoodRepository = tourFoodRepository;
        this.tourTransportRepository = tourTransportRepository;
        this.provinceRepository = provinceRepository;
        this.locationRepository = locationRepository;
        this.foodRepository = foodRepository;
        this.transportTypeRepository = transportTypeRepository;
    }

    public RecommendationResponse recommend(RecommendationRequest request) {
        RecommendationRequest safeRequest = request == null ? new RecommendationRequest() : request;

        DbSnapshot snapshot = loadSnapshot();
        if (snapshot.tours.isEmpty()) {
            RecommendationResponse empty = new RecommendationResponse();
            empty.setModel("Hybrid-TokenMF-CBF-v3");
            empty.setColdStart(true);
            empty.setMessage("Hệ thống chưa có dữ liệu tour để đưa ra đề xuất. Vui lòng thử lại sau khi đã thêm một số tour vào hệ thống.");
            empty.setRecommendations(List.of());
            return empty;
        }

        UserPreference preference = resolvePreference(safeRequest);
        TokenMfModel model = trainTokenModel(snapshot.tourFeatures);
        double[] preferenceVector = buildPreferenceVector(preference, safeRequest, snapshot, model);
        boolean coldStart = preferenceVector == null;

        int topK = Math.min(10, Math.max(1, safeRequest.getTopK() == null ? 3 : safeRequest.getTopK()));

        List<ScoredTour> scoredTours = snapshot.tours.stream()
                .map(tour -> scoreTourForUser(tour, preference, preferenceVector, coldStart, snapshot, model))
                .sorted(Comparator.comparingDouble(ScoredTour::hybridScore).reversed())
                .limit(topK)
                .toList();

        RecommendationResponse response = new RecommendationResponse();
        response.setColdStart(coldStart);
        response.setModel("Hybrid-TokenMF-CBF-v3");
        response.setRecommendations(scoredTours.stream().map(this::toDto).collect(Collectors.toList()));
        response.setMessage(buildAssistantMessage(safeRequest.getQuery(), preference, scoredTours));
        return response;
    }

    private ScoredTour scoreTourForUser(TourAggregate tour,
                                        UserPreference preference,
                                        double[] preferenceVector,
                                        boolean coldStart,
                                        DbSnapshot snapshot,
                                        TokenMfModel model) {
        double cbfScore = scorePreferenceMatch(tour, preference);
        double cfScore = scoreCollaborative(tour.tourId, preferenceVector, model);
        double popularity = snapshot.popularityByTour.getOrDefault(tour.tourId, 0.45);

        double cfWeight = coldStart ? 0.35 : 0.60;
        double hybridScore = cfWeight * cfScore + (1 - cfWeight) * cbfScore + 0.08 * popularity;

        if (!"Tat ca".equalsIgnoreCase(preference.region)
                && !preference.region.equalsIgnoreCase(tour.regionLabel)) {
            hybridScore *= 0.85;
        }

        return new ScoredTour(tour, cbfScore, cfScore, hybridScore);
    }

    private double scoreCollaborative(String tourId, double[] preferenceVector, TokenMfModel model) {
        if (preferenceVector == null) {
            return 0.5;
        }

        double[] itemVector = model.itemFactors.get(tourId);
        if (itemVector == null) {
            return 0.5;
        }

        return sigmoid(dot(preferenceVector, itemVector));
    }

    private double scorePreferenceMatch(TourAggregate tour, UserPreference pref) {
        double score = 0;

        if ("Tat ca".equalsIgnoreCase(pref.region) || pref.region.equalsIgnoreCase(tour.regionLabel)) {
            score += 0.30;
        }

        if ("any".equalsIgnoreCase(pref.budget)) {
            score += 0.10;
        } else if ("low".equalsIgnoreCase(pref.budget) && tour.estimatedPrice < 2_000_000) {
            score += 0.30;
        } else if ("mid".equalsIgnoreCase(pref.budget)
                && tour.estimatedPrice >= 2_000_000
                && tour.estimatedPrice <= 5_000_000) {
            score += 0.30;
        } else if ("high".equalsIgnoreCase(pref.budget) && tour.estimatedPrice > 5_000_000) {
            score += 0.30;
        }

        score += Math.max(0, 0.20 - Math.abs(tour.durationDays - pref.days) * 0.05);

        if ("beach".equalsIgnoreCase(pref.style) && tour.styleTokens.contains("beach")) {
            score += 0.25;
        }
        if ("adventure".equalsIgnoreCase(pref.style) && tour.styleTokens.contains("adventure")) {
            score += 0.25;
        }
        if ("culture".equalsIgnoreCase(pref.style) && tour.styleTokens.contains("culture")) {
            score += 0.25;
        }
        if ("family".equalsIgnoreCase(pref.style) && tour.styleTokens.contains("family")) {
            score += 0.20;
        }

        return Math.max(0, Math.min(1.0, score));
    }

    private UserPreference resolvePreference(RecommendationRequest request) {
        String query = lower(request.getQuery());

        String region = request.getRegion();
        if (isBlank(region)) {
            region = detectRegion(query);
        }

        String budget = request.getBudget();
        if (isBlank(budget)) {
            budget = detectBudget(query);
        }

        String style = request.getStyle();
        if (isBlank(style)) {
            style = detectStyle(query);
        }

        Integer days = request.getDays();
        if (days == null || days <= 0) {
            days = detectDays(query);
        }

        return new UserPreference(region, budget, style, Math.max(1, days));
    }

    private String buildAssistantMessage(String query, UserPreference pref, List<ScoredTour> scoredTours) {
        if (scoredTours.isEmpty()) {
            return "He thong chua tim thay tour phu hop. Ban thu mo ta ro hon ve ngan sach, khu vuc va so ngay di.";
        }

        ScoredTour best = scoredTours.get(0);
        String base = "He thong da chay mo hinh Hybrid (Token Matrix Factorization + CBF) tren du lieu thuc trong MySQL de xep hang de xuat.";
        String filter = "Bo loc hien tai: khu vuc=" + pref.region + ", ngan sach=" + pref.budget + ", so ngay=" + pref.days + ", phong cach=" + pref.style + ".";

        if (lower(query).contains("lich trinh")) {
            return base + " Goi y lich trinh nhanh: ngay 1 tham quan " + best.tour.locationName
                    + ", ngay 2 trai nghiem tour " + best.tour.tourName
                    + ", ngay cuoi thu gian va thu am thuc dia phuong. " + filter;
        }

        return base + " Tour phu hop nhat hien tai la " + best.tour.tourName + " tai " + best.tour.locationName + ". " + filter;
    }

    private RecommendationItemResponse toDto(ScoredTour s) {
        RecommendationItemResponse dto = new RecommendationItemResponse();
        dto.setTourId(s.tour.tourId);
        dto.setTourName(s.tour.tourName);
        dto.setLocationId(s.tour.locationId);
        dto.setLocationName(s.tour.locationName);
        dto.setProvince(s.tour.provinceName);
        dto.setImage(s.tour.image);
        dto.setPrice(s.tour.estimatedPrice);
        dto.setStartDate(s.tour.startDate.toString());
        dto.setEndDate(s.tour.endDate.toString());
        dto.setCfScore(round3(s.cfScore));
        dto.setCbfScore(round3(s.cbfScore));
        dto.setHybridScore(round3(s.hybridScore));
        dto.setReason("Hybrid=" + round3(s.hybridScore)
                + " | CF(TokenMF)=" + round3(s.cfScore)
                + " | CBF=" + round3(s.cbfScore));
        return dto;
    }

    private DbSnapshot loadSnapshot() {
        List<VirtualTour> tours = virtualTourRepository.findAll();
        List<String> tourIds = tours.stream().map(VirtualTour::getTourId).filter(Objects::nonNull).toList();
        if (tourIds.isEmpty()) {
            return new DbSnapshot(List.of(), Map.of(), Map.of());
        }

        Map<Integer, Province> provinceById = provinceRepository.findAll().stream()
                .collect(Collectors.toMap(Province::getProvinceId, p -> p));
        Map<Integer, Location> locationById = locationRepository.findAll().stream()
                .collect(Collectors.toMap(Location::getLocationId, l -> l));
        Map<Integer, Food> foodById = foodRepository.findAll().stream()
                .collect(Collectors.toMap(Food::getFoodId, f -> f));
        Map<Integer, TransportType> transportById = transportTypeRepository.findAll().stream()
                .collect(Collectors.toMap(TransportType::getTransportId, t -> t));

        Map<String, List<TourProvince>> provincesByTour = tourProvinceRepository.findByTourIdIn(tourIds).stream()
                .collect(Collectors.groupingBy(TourProvince::getTourId));
        Map<String, List<TourLocation>> locationsByTour = tourLocationRepository.findByTourIdIn(tourIds).stream()
                .collect(Collectors.groupingBy(TourLocation::getTourId));
        Map<String, List<TourFood>> foodsByTour = tourFoodRepository.findByTourIdIn(tourIds).stream()
                .collect(Collectors.groupingBy(TourFood::getTourId));
        Map<String, List<TourTransport>> transportsByTour = tourTransportRepository.findByTourIdIn(tourIds).stream()
                .collect(Collectors.groupingBy(TourTransport::getTourId));

        List<TourAggregate> aggregates = new ArrayList<>();
        Map<String, Set<String>> featuresByTour = new HashMap<>();
        Map<String, Double> popularityByTour = new HashMap<>();

        for (VirtualTour tour : tours) {
            String tourId = tour.getTourId();
            if (isBlank(tourId)) {
                continue;
            }

            List<TourProvince> linkedProvinces = new ArrayList<>(provincesByTour.getOrDefault(tourId, List.of()));
            linkedProvinces.sort(Comparator.comparingInt(tp -> tp.getVisitOrder() == null ? Integer.MAX_VALUE : tp.getVisitOrder()));

            List<TourLocation> linkedLocations = locationsByTour.getOrDefault(tourId, List.of());
            List<TourFood> linkedFoods = foodsByTour.getOrDefault(tourId, List.of());
            List<TourTransport> linkedTransports = transportsByTour.getOrDefault(tourId, List.of());

            List<String> provinceNames = linkedProvinces.stream()
                    .map(tp -> provinceById.get(tp.getProvinceId()))
                    .filter(Objects::nonNull)
                    .map(Province::getName)
                    .filter(Objects::nonNull)
                    .toList();

            List<Location> locationList = linkedLocations.stream()
                    .map(tl -> locationById.get(tl.getLocationId()))
                    .filter(Objects::nonNull)
                    .toList();

            List<Food> foodList = linkedFoods.stream()
                    .map(tf -> foodById.get(tf.getFoodId()))
                    .filter(Objects::nonNull)
                    .toList();

            List<TransportType> transportList = linkedTransports.stream()
                    .map(tt -> transportById.get(tt.getTransportId()))
                    .filter(Objects::nonNull)
                    .toList();

            Location primaryLocation = locationList.isEmpty() ? null : locationList.get(0);
            Integer locationId = primaryLocation == null ? null : primaryLocation.getLocationId();
            String locationName = primaryLocation == null ? "Unknown" : safe(primaryLocation.getName(), "Unknown");
            String image = primaryLocation == null ? "" : safe(primaryLocation.getImage(), "");

            String provinceName = !provinceNames.isEmpty() ? provinceNames.get(0)
                    : (primaryLocation == null ? "Unknown"
                    : safe(provinceById.getOrDefault(primaryLocation.getProvinceId(), new Province()).getName(), "Unknown"));

            String regionLabel = inferRegionFromProvinces(provinceNames);
            int durationDays = Math.max(1, linkedProvinces.isEmpty() ? locationList.size() : linkedProvinces.size());
            int estimatedPrice = estimatePrice(locationList, foodList, transportList, linkedTransports.size(), durationDays);

            Set<String> styleTokens = inferStyleTokens(locationList, foodList, transportList, provinceNames);
            Set<String> featureTokens = buildTourFeatureTokens(regionLabel, durationDays, estimatedPrice, provinceNames, locationList, foodList, transportList, styleTokens);

            LocalDate startDate = (tour.getCreatedAt() == null ? LocalDate.now() : tour.getCreatedAt().toLocalDate());
            LocalDate endDate = startDate.plusDays(Math.max(0, durationDays - 1));

            TourAggregate aggregate = new TourAggregate(
                    tourId,
                    safe(tour.getName(), "Untitled Tour"),
                    locationId,
                    locationName,
                    provinceName,
                    image,
                    estimatedPrice,
                    startDate,
                    endDate,
                    durationDays,
                    regionLabel,
                    styleTokens
            );

            aggregates.add(aggregate);
            featuresByTour.put(tourId, featureTokens);
            popularityByTour.put(tourId, popularityFromRelations(linkedProvinces.size(), linkedLocations.size(), linkedFoods.size(), linkedTransports.size()));
        }

        return new DbSnapshot(aggregates, featuresByTour, popularityByTour);
    }

    private TokenMfModel trainTokenModel(Map<String, Set<String>> featuresByTour) {
        Map<String, double[]> tokenFactors = new HashMap<>();
        Map<String, double[]> itemFactors = new HashMap<>();
        List<Interaction> positiveInteractions = new ArrayList<>();

        Random random = new Random(RANDOM_SEED);
        List<String> tourIds = new ArrayList<>(featuresByTour.keySet());
        for (String tourId : tourIds) {
            itemFactors.put(tourId, randomVector(random, FACTOR_DIM));
            Set<String> tokens = featuresByTour.getOrDefault(tourId, Set.of());
            for (String token : tokens) {
                tokenFactors.computeIfAbsent(token, t -> randomVector(random, FACTOR_DIM));
                positiveInteractions.add(new Interaction(token, tourId));
            }
        }

        if (positiveInteractions.isEmpty()) {
            return new TokenMfModel(tokenFactors, itemFactors);
        }

        Set<String> positiveKey = positiveInteractions.stream()
                .map(i -> i.token + "::" + i.tourId)
                .collect(Collectors.toSet());

        double lr = LEARNING_RATE;
        for (int epoch = 0; epoch < TRAIN_EPOCHS; epoch++) {
            Collections.shuffle(positiveInteractions, random);

            for (Interaction interaction : positiveInteractions) {
                updateBinaryInteraction(tokenFactors.get(interaction.token), itemFactors.get(interaction.tourId), 1.0, lr);

                if (tourIds.size() > 1) {
                    String negativeTourId = tourIds.get(random.nextInt(tourIds.size()));
                    String key = interaction.token + "::" + negativeTourId;
                    if (!positiveKey.contains(key)) {
                        updateBinaryInteraction(tokenFactors.get(interaction.token), itemFactors.get(negativeTourId), 0.0, lr);
                    }
                }
            }

            lr *= LEARNING_DECAY;
        }

        return new TokenMfModel(tokenFactors, itemFactors);
    }

    private void updateBinaryInteraction(double[] tokenVector, double[] itemVector, double target, double lr) {
        if (tokenVector == null || itemVector == null) {
            return;
        }

        double pred = sigmoid(dot(tokenVector, itemVector));
        double err = target - pred;

        for (int idx = 0; idx < tokenVector.length; idx++) {
            double tv = tokenVector[idx];
            double iv = itemVector[idx];
            tokenVector[idx] += lr * (err * iv - REGULARIZATION * tv);
            itemVector[idx] += lr * (err * tv - REGULARIZATION * iv);
        }
    }

    private double[] buildPreferenceVector(UserPreference preference,
                                           RecommendationRequest request,
                                           DbSnapshot snapshot,
                                           TokenMfModel model) {
        Set<String> preferenceTokens = new HashSet<>();
        preferenceTokens.add("region:" + lower(preference.region));
        preferenceTokens.add("budget:" + lower(preference.budget));
        preferenceTokens.add("days:" + durationTier(preference.days));
        if (!"any".equalsIgnoreCase(preference.style)) {
            preferenceTokens.add("style:" + lower(preference.style));
        }

        String query = lower(request.getQuery());
        for (TourAggregate tour : snapshot.tours) {
            if (query.contains(lower(tour.provinceName))) {
                preferenceTokens.add("province:" + lower(tour.provinceName));
            }
            if (query.contains(lower(tour.locationName))) {
                preferenceTokens.add("location:" + lower(tour.locationName));
            }
        }

        List<double[]> vectors = preferenceTokens.stream()
                .map(model.tokenFactors::get)
                .filter(Objects::nonNull)
                .toList();

        if (vectors.isEmpty()) {
            return null;
        }

        double[] result = new double[FACTOR_DIM];
        for (double[] vec : vectors) {
            for (int idx = 0; idx < FACTOR_DIM; idx++) {
                result[idx] += vec[idx];
            }
        }

        for (int idx = 0; idx < FACTOR_DIM; idx++) {
            result[idx] /= vectors.size();
        }
        return result;
    }

    private double[] randomVector(Random random, int size) {
        double[] v = new double[size];
        for (int idx = 0; idx < size; idx++) {
            v[idx] = (random.nextDouble() - 0.5) * 0.15;
        }
        return v;
    }

    private double dot(double[] a, double[] b) {
        double sum = 0;
        for (int idx = 0; idx < a.length; idx++) {
            sum += a[idx] * b[idx];
        }
        return sum;
    }

    private double sigmoid(double value) {
        if (value > 20) {
            return 1.0;
        }
        if (value < -20) {
            return 0.0;
        }
        return 1.0 / (1.0 + Math.exp(-value));
    }

    private String detectRegion(String query) {
        if (query.contains("mien bac") || query.contains("ha noi") || query.contains("bac")) return "Bac";
        if (query.contains("mien trung") || query.contains("trung")) return "Trung";
        if (query.contains("ho chi minh") || query.contains("tp hcm") || query.contains("sai gon")) return "Nam";
        return "Tat ca";
    }

    private String detectBudget(String query) {
        if (query.contains("duoi 2") || query.contains("< 2") || query.contains("re")) return "low";
        if (query.contains("2") && query.contains("5")) return "mid";
        if (query.contains("tren 5") || query.contains("> 5") || query.contains("cao cap")) return "high";
        return "any";
    }

    private String detectStyle(String query) {
        if (query.contains("bien") || query.contains("nghi duong") || query.contains("resort")) return "beach";
        if (query.contains("leo nui") || query.contains("trek") || query.contains("phuot") || query.contains("kayak")) return "adventure";
        if (query.contains("van hoa") || query.contains("co do") || query.contains("lich su") || query.contains("pho co")) return "culture";
        if (query.contains("gia dinh") || query.contains("tre em")) return "family";
        return "any";
    }

    private int detectDays(String query) {
        Matcher m = DAY_PATTERN.matcher(query);
        if (!m.find()) {
            return 3;
        }

        try {
            return Math.max(1, Integer.parseInt(m.group(1)));
        } catch (NumberFormatException ex) {
            return 3;
        }
    }

    private String durationTier(int days) {
        if (days <= 2) return "short";
        if (days <= 4) return "medium";
        return "long";
    }

    private String budgetTier(int price) {
        if (price < 2_000_000) return "low";
        if (price <= 5_000_000) return "mid";
        return "high";
    }

    private int estimatePrice(List<Location> locations,
                              List<Food> foods,
                              List<TransportType> transports,
                              int transportHops,
                              int durationDays) {
        int locationCost = (int) locations.stream()
                .map(Location::getEstimatedCost)
                .filter(Objects::nonNull)
                .mapToInt(v -> v)
                .average()
                .orElse(1_200_000);

        int foodCost = (int) foods.stream()
                .map(Food::getEstimatedPrice)
                .filter(Objects::nonNull)
                .mapToInt(v -> v)
                .average()
                .orElse(250_000);

        int transportCost = (int) transports.stream()
                .map(TransportType::getCostPerKm)
                .filter(Objects::nonNull)
                .mapToDouble(v -> v)
                .average()
                .orElse(14_000.0);

        int mealMultiplier = Math.max(1, durationDays) * 2;
        int hopMultiplier = Math.max(1, transportHops);

        return Math.max(500_000, locationCost + foodCost * mealMultiplier + transportCost * hopMultiplier);
    }

    private String inferRegionFromProvinces(List<String> provinceNames) {
        if (provinceNames.isEmpty()) {
            return "Tat ca";
        }

        long north = provinceNames.stream().filter(this::isNorthernProvince).count();
        long central = provinceNames.stream().filter(this::isCentralProvince).count();
        long south = provinceNames.stream().filter(this::isSouthernProvince).count();

        if (north >= central && north >= south) return "Bac";
        if (central >= north && central >= south) return "Trung";
        return "Nam";
    }

    private boolean isNorthernProvince(String name) {
        String n = lower(name);
        return n.contains("ha noi") || n.contains("hai phong") || n.contains("quang ninh") || n.contains("lao cai")
                || n.contains("ninh binh") || n.contains("thai nguyen") || n.contains("lang son");
    }

    private boolean isCentralProvince(String name) {
        String n = lower(name);
        return n.contains("da nang") || n.contains("quang nam") || n.contains("hue") || n.contains("thua thien")
                || n.contains("khanh hoa") || n.contains("nghe an") || n.contains("ha tinh");
    }

    private boolean isSouthernProvince(String name) {
        String n = lower(name);
        return n.contains("ho chi minh");
    }

    private Set<String> inferStyleTokens(List<Location> locations,
                                         List<Food> foods,
                                         List<TransportType> transports,
                                         List<String> provinces) {
        Set<String> styles = new HashSet<>();

        String mergedText = (
                locations.stream().map(Location::getName).collect(Collectors.joining(" ")) + " "
                        + locations.stream().map(l -> safe(l.getDescription(), "")).collect(Collectors.joining(" ")) + " "
                        + foods.stream().map(f -> safe(f.getType(), "")).collect(Collectors.joining(" ")) + " "
                        + String.join(" ", provinces) + " "
                        + transports.stream().map(TransportType::getName).collect(Collectors.joining(" "))
        ).toLowerCase(Locale.ROOT);

        if (mergedText.contains("bien") || mergedText.contains("island") || mergedText.contains("phu quoc") || mergedText.contains("ha long")) {
            styles.add("beach");
        }
        if (mergedText.contains("trek") || mergedText.contains("leo") || mergedText.contains("nui") || mergedText.contains("bike")) {
            styles.add("adventure");
        }
        if (mergedText.contains("co do") || mergedText.contains("van hoa") || mergedText.contains("lich su") || mergedText.contains("pho co")) {
            styles.add("culture");
        }
        if (locations.size() >= 2 || foods.size() >= 2) {
            styles.add("family");
        }

        if (styles.isEmpty()) {
            styles.add("culture");
        }
        return styles;
    }

    private Set<String> buildTourFeatureTokens(String region,
                                               int durationDays,
                                               int estimatedPrice,
                                               List<String> provinces,
                                               List<Location> locations,
                                               List<Food> foods,
                                               List<TransportType> transports,
                                               Set<String> styleTokens) {
        Set<String> tokens = new HashSet<>();
        tokens.add("region:" + lower(region));
        tokens.add("days:" + durationTier(durationDays));
        tokens.add("budget:" + budgetTier(estimatedPrice));

        provinces.forEach(p -> tokens.add("province:" + lower(p)));
        locations.forEach(l -> tokens.add("location:" + lower(safe(l.getName(), "unknown"))));
        foods.forEach(f -> {
            tokens.add("food:" + lower(safe(f.getName(), "unknown")));
            if (!isBlank(f.getType())) {
                tokens.add("foodtype:" + lower(f.getType()));
            }
        });
        transports.forEach(t -> tokens.add("transport:" + lower(safe(t.getName(), "unknown"))));
        styleTokens.forEach(s -> tokens.add("style:" + lower(s)));
        return tokens;
    }

    private double popularityFromRelations(int provinceCount, int locationCount, int foodCount, int transportCount) {
        double raw = provinceCount * 0.30 + locationCount * 0.25 + foodCount * 0.20 + transportCount * 0.25;
        return Math.max(0.2, Math.min(1.0, raw / 4.0));
    }

    private String safe(String value, String fallback) {
        return isBlank(value) ? fallback : value;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String lower(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT);
    }

    private double round3(double value) {
        return Math.round(value * 1000.0) / 1000.0;
    }

    private record UserPreference(String region, String budget, String style, int days) {
    }

    private record TourAggregate(String tourId,
                                 String tourName,
                                 Integer locationId,
                                 String locationName,
                                 String provinceName,
                                 String image,
                                 int estimatedPrice,
                                 LocalDate startDate,
                                 LocalDate endDate,
                                 int durationDays,
                                 String regionLabel,
                                 Set<String> styleTokens) {
    }

    private record DbSnapshot(List<TourAggregate> tours,
                              Map<String, Set<String>> tourFeatures,
                              Map<String, Double> popularityByTour) {
    }

    private record ScoredTour(TourAggregate tour,
                              double cbfScore,
                              double cfScore,
                              double hybridScore) {
    }

    private record Interaction(String token, String tourId) {
    }

    private record TokenMfModel(Map<String, double[]> tokenFactors,
                                Map<String, double[]> itemFactors) {
    }
}
