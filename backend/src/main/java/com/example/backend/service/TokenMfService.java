package com.example.backend.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TokenMfService {

    private static final int FACTOR_DIM = 12;
    private static final int TRAIN_EPOCHS = 260;
    private static final double LEARNING_RATE = 0.03;
    private static final double REGULARIZATION = 0.02;
    private static final double LEARNING_DECAY = 0.992;
    private static final long RANDOM_SEED = 42L;

    public TokenMfModel trainTokenModel(Map<String, Set<String>> featuresByTour) {
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

    private double[] randomVector(Random random, int size) {
        double[] v = new double[size];
        for (int idx = 0; idx < size; idx++) {
            v[idx] = (random.nextDouble() - 0.5) * 0.15;
        }
        return v;
    }

    public double dot(double[] a, double[] b) {
        double sum = 0;
        for (int idx = 0; idx < a.length; idx++) {
            sum += a[idx] * b[idx];
        }
        return sum;
    }

    public double sigmoid(double value) {
        if (value > 20) {
            return 1.0;
        }
        if (value < -20) {
            return 0.0;
        }
        return 1.0 / (1.0 + Math.exp(-value));
    }

    public record TokenMfModel(Map<String, double[]> tokenFactors,
                               Map<String, double[]> itemFactors) {
    }

    public record Interaction(String token, String tourId) {
    }
}
