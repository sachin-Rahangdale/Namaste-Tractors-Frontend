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