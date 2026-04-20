const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

// ==================== LOCATIONS ====================
export const getLocations = async (params = {}) => {
  try {
    const { page = 0, size = 9, q, type, provinceId } = params;
    const query = new URLSearchParams({ page, size });
    if (q) query.append("q", q);
    if (type && type !== "Tất cả") query.append("type", type);
    if (provinceId) query.append("provinceId", provinceId);

    const res = await fetch(`${API_BASE}/api/locations?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch locations");
    return await res.json();
  } catch (err) {
    console.error("Error fetching locations:", err);
    return { content: [], totalPages: 0, totalElements: 0 };
  }
};

export const getLocationTypes = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/locations/types`);
    if (!res.ok) throw new Error("Failed to fetch location types");
    return await res.json();
  } catch (err) {
    console.error("Error fetching location types:", err);
    return [];
  }
};

export const getLocationById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/locations/${id}`);
    if (!res.ok) throw new Error("Failed to fetch location");
    return await res.json();
  } catch (err) {
    console.error("Error fetching location:", err);
    return null;
  }
};

export const getLocationsByProvince = async (provinceId) => {
  try {
    const res = await fetch(
      `${API_BASE}/api/locations/by-province/${provinceId}`,
    );
    if (!res.ok) throw new Error("Failed to fetch locations by province");
    return await res.json();
  } catch (err) {
    console.error("Error fetching locations by province:", err);
    return [];
  }
};

// ==================== PROVINCES ====================
export const getProvinces = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/provinces`);
    if (!res.ok) throw new Error("Failed to fetch provinces");
    return await res.json();
  } catch (err) {
    console.error("Error fetching provinces:", err);
    return [];
  }
};

export const getProvinceById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/provinces/${id}`);
    if (!res.ok) throw new Error("Failed to fetch province");
    return await res.json();
  } catch (err) {
    console.error("Error fetching province:", err);
    return null;
  }
};

// ==================== TOURS ====================
export const getTours = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/tours`);
    if (!res.ok) throw new Error("Failed to fetch tours");
    return await res.json();
  } catch (err) {
    console.error("Error fetching tours:", err);
    return [];
  }
};

export const getTourById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/tours/${id}`);
    if (!res.ok) throw new Error("Failed to fetch tour");
    return await res.json();
  } catch (err) {
    console.error("Error fetching tour:", err);
    return null;
  }
};

export const getTourFullDetails = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/tours/${id}/full`);
    if (!res.ok) throw new Error("Failed to fetch tour details");
    return await res.json();
  } catch (err) {
    console.error("Error fetching tour details:", err);
    return null;
  }
};

export const getMyTours = async (userId) => {
  try {
    const res = await fetch(`${API_BASE}/api/tours/my-tours/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch my tours");
    return await res.json();
  } catch (err) {
    console.error("Error fetching my tours:", err);
    return [];
  }
};

export const createTour = async (tourData) => {
  try {
    const res = await fetch(`${API_BASE}/api/tours`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tourData),
    });
    if (!res.ok) throw new Error("Failed to create tour");
    return await res.json();
  } catch (err) {
    console.error("Error creating tour:", err);
    return null;
  }
};

export const getRecommendations = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/api/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || "Failed to fetch recommendations");
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    return { message: err.message, recommendations: [] };
  }
};

// ==================== FOODS ====================
export const getFoods = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/foods`);
    if (!res.ok) throw new Error("Failed to fetch foods");
    return await res.json();
  } catch (err) {
    console.error("Error fetching foods:", err);
    return [];
  }
};

export const getFoodById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/foods/${id}`);
    if (!res.ok) throw new Error("Failed to fetch food");
    return await res.json();
  } catch (err) {
    console.error("Error fetching food:", err);
    return null;
  }
};

// ==================== TRANSPORTS ====================
export const getTransports = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/transports`);
    if (!res.ok) throw new Error("Failed to fetch transports");
    return await res.json();
  } catch (err) {
    console.error("Error fetching transports:", err);
    return [];
  }
};

// ==================== ADMIN - USERS ====================
export const getAllUsers = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/users`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
};

export const updateUserAsAdmin = async (userId, formData) => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
      method: "PUT",
      body: formData,
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to update user");
    }
    return { success: true, user: await res.json() };
  } catch (err) {
    console.error("Error updating user:", err);
    return { success: false, message: err.message };
  }
};

export const deleteUser = async (userId) => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return { success: true };
  } catch (err) {
    console.error("Error deleting user:", err);
    return { success: false, message: err.message };
  }
};

// ==================== ADMIN - LOCATIONS ====================
export const createLocation = async (locationData) => {
  try {
    const res = await fetch(`${API_BASE}/api/locations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(locationData),
    });
    if (!res.ok) throw new Error("Failed to create location");
    return { success: true, data: await res.json() };
  } catch (err) {
    console.error("Error creating location:", err);
    return { success: false, message: err.message };
  }
};

export const deleteLocation = async (locationId) => {
  try {
    const res = await fetch(`${API_BASE}/api/locations/${locationId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete location");
    return { success: true };
  } catch (err) {
    console.error("Error deleting location:", err);
    return { success: false, message: err.message };
  }
};

// ==================== ADMIN - FOODS ====================
export const createFood = async (foodData) => {
  try {
    const res = await fetch(`${API_BASE}/api/foods`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(foodData),
    });
    if (!res.ok) throw new Error("Failed to create food");
    return { success: true, data: await res.json() };
  } catch (err) {
    console.error("Error creating food:", err);
    return { success: false, message: err.message };
  }
};

export const updateFood = async (foodId, foodData) => {
  try {
    const res = await fetch(`${API_BASE}/api/foods/${foodId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(foodData),
    });
    if (!res.ok) throw new Error("Failed to update food");
    return { success: true, data: await res.json() };
  } catch (err) {
    console.error("Error updating food:", err);
    return { success: false, message: err.message };
  }
};

export const deleteFood = async (foodId) => {
  try {
    const res = await fetch(`${API_BASE}/api/foods/${foodId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete food");
    return { success: true };
  } catch (err) {
    console.error("Error deleting food:", err);
    return { success: false, message: err.message };
  }
};

// ==================== ADMIN - PROVINCES ====================
export const createProvince = async (provinceData) => {
  try {
    const res = await fetch(`${API_BASE}/api/provinces`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(provinceData),
    });
    if (!res.ok) throw new Error("Failed to create province");
    return { success: true, data: await res.json() };
  } catch (err) {
    console.error("Error creating province:", err);
    return { success: false, message: err.message };
  }
};

export const updateProvince = async (provinceId, provinceData) => {
  try {
    const res = await fetch(`${API_BASE}/api/provinces/${provinceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(provinceData),
    });
    if (!res.ok) throw new Error("Failed to update province");
    return { success: true, data: await res.json() };
  } catch (err) {
    console.error("Error updating province:", err);
    return { success: false, message: err.message };
  }
};

export const deleteProvince = async (provinceId) => {
  try {
    const res = await fetch(`${API_BASE}/api/provinces/${provinceId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete province");
    return { success: true };
  } catch (err) {
    console.error("Error deleting province:", err);
    return { success: false, message: err.message };
  }
};

// ==================== ADMIN - TRANSPORTS ====================
export const createTransport = async (transportData) => {
  try {
    const res = await fetch(`${API_BASE}/api/transports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transportData),
    });
    if (!res.ok) throw new Error("Failed to create transport");
    return { success: true, data: await res.json() };
  } catch (err) {
    console.error("Error creating transport:", err);
    return { success: false, message: err.message };
  }
};

// ==================== INTERACTIONS ====================
export const logInteraction = async (userId, locationId, eventType) => {
  if (!userId || !locationId) return;
  try {
    const res = await fetch(`${API_BASE}/api/interactions/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        location_id: locationId,
        event_type: eventType,
      }),
    });
    return await res.json();
  } catch (err) {
    console.error("Error logging interaction:", err);
  }
};

// ==================== HELPERS ====================
export const formatPrice = (p) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    p,
  );
