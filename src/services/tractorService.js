import api from "../api/axios";

export const getTractors = async (page = 0, size = 10) => {
  try {
    const response = await api.get("/tractors", {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tractors:", error);
    throw error;
  }
};


export const getTractorById = async (id) => {
  try {
    const response = await api.get(`/tractors/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tractor details:", error);
    throw error;
  }
};

export const getFilteredTractors = async (filters) => {
  // filters object will contain: brandId, minHp, maxHp, minPrice, maxPrice, page, size
  const response = await api.get("/tractors/filter", { params: filters });
  return response.data;
};

export const getTractorsByBrand = async (brandId, page = 0, size = 10) => {
  const response = await api.get(`/tractors/brand/${brandId}`, { params: { page, size } });
  return response.data;
};


export const createTractor = async (data) => {
  const res = await api.post("/tractors", data);
  return res.data;
};

export const updateTractor = async (id, data) => {
  const res = await api.put(`/tractors/${id}`, data);
  return res.data;
};

export const deleteTractor = async (id) => {
  const res = await api.delete(`/tractors/${id}`);
  return res.data;
};

export const uploadTractorImage = async (id, imageFile, type = "MAIN") => {
  const formData = new FormData();
  formData.append("image", imageFile);
  const res = await api.post(`/tractors/${id}/images`, formData, {
    params: { type },
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};