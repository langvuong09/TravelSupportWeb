const PROVINCE_NAME_TO_ID = {
  "lào cai": 1,
  "lao cai": 1,
  "yên bái": 2,
  "yen bai": 2,
  "tuyên quang": 3,
  "tuyen quang": 3,
  "thái nguyên": 4,
  "thai nguyen": 4,
  "phú thọ": 5,
  "phu tho": 5,
  "bắc giang": 6,
  "bac giang": 6,
  "bắc ninh": 7,
  "bac ninh": 7,
  "hải phòng": 8,
  "hai phong": 8,
  "hưng yên": 9,
  "hung yen": 9,
  "ninh bình": 10,
  "ninh binh": 10,
  "quảng trị": 11,
  "quang tri": 11,
  "quảng bình": 12,
  "quang binh": 12,
  "đà nẵng": 13,
  "da nang": 13,
  "quảng ngãi": 14,
  "quang ngai": 14,
  "gia lai": 15,
  "gia lai": 15,
  "đắk lắk": 16,
  "dak lak": 16,
  "lâm đồng": 17,
  "lam dong": 17,
  "khánh hòa": 18,
  "khanh hoa": 18,
  "đồng nai": 19,
  "dong nai": 19,
  "tây ninh": 20,
  "tay ninh": 20,
  "tp hồ chí minh": 21,
  "thành phố hồ chí minh": 21,
  "ho chi minh": 21,
  hcm: 21,
  "sài gòn": 21,
  "sai gon": 21,
  "đồng tháp": 22,
  "dong thap": 22,
  "vĩnh long": 23,
  "vinh long": 23,
  "an giang": 24,
  "tp cần thơ": 25,
  "thành phố cần thơ": 25,
  "can tho": 25,
  "cà mau": 26,
  "ca mau": 26,
  "sơn la": 27,
  "son la": 27,
  "thanh hóa": 28,
  "thanh hoa": 28,
  "hà tĩnh": 29,
  "ha tinh": 29,
  "thừa thiên huế": 30,
  "thua thien hue": 30,
  huế: 30,
  hue: 30,
  "bình định": 31,
  "binh dinh": 31,
  "bình dương": 32,
  "binh duong": 32,
  "bà rịa vũng tàu": 33,
  "ba ria vung tau": 33,
  "vũng tàu": 33,
  "vung tau": 33,
  "hà nội": 34,
  "ha noi": 34,
};

function normalizeName(value) {
  if (!value) return "";
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ");
}

export function parseProvinceNamesToIds(value) {
  if (!value?.trim()) return [];
  return value
    .split(/[,;]+/)
    .map((v) => normalizeName(v))
    .map((name) => PROVINCE_NAME_TO_ID[name])
    .filter((id) => Number.isInteger(id));
}

export function parseRecommendationProvinces(provinceText, provinces) {
  if (!provinceText || !Array.isArray(provinces) || provinces.length === 0) {
    return [];
  }

  const cleaned = provinceText
    .split(/[,;]+/)
    .map((part) => normalizeName(part))
    .filter(Boolean);

  const ids = new Set();

  for (const part of cleaned) {
    const exactMatch = provinces.find((p) => normalizeName(p.name) === part);
    if (exactMatch) {
      ids.add(exactMatch.provinceId);
      continue;
    }

    const fuzzyMatch = provinces.find((p) => {
      const normalized = normalizeName(p.name);
      return normalized.includes(part) || part.includes(normalized);
    });
    if (fuzzyMatch) {
      ids.add(fuzzyMatch.provinceId);
    }
  }

  return Array.from(ids);
}

export function findLocationByName(locationName, locations) {
  if (!locationName || !Array.isArray(locations) || locations.length === 0) {
    return null;
  }

  const normalized = normalizeName(locationName);
  return (
    locations.find((loc) => normalizeName(loc.name) === normalized) ||
    locations.find((loc) => normalizeName(loc.name).includes(normalized)) ||
    locations.find((loc) => normalized.includes(normalizeName(loc.name))) ||
    null
  );
}
