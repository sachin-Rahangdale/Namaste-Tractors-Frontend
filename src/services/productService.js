import api from "../api/axios";

export const getProducts = async (page = 0, size = 10) => {
  try {
    const response = await api.get("/products", {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};



export const getProductsByCity = async (city, page = 0, size = 12) => {
  const res = await api.get(`/products/city/${city}`, { params: { page, size } });
  return res.data;
};

export const getMyProducts = async (page = 0, size = 10) => {
  const res = await api.get("/products/my", { params: { page, size } });
  return res.data;
};

export const createProduct = async (productData) => {
  const res = await api.post("/products", productData);
  return res.data;
};

export const updateProduct = async (id, updateData) => {
  const res = await api.put(`/products/${id}`, updateData);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const uploadProductImages = async (id, formData) => {
  const res = await api.post(`/products/${id}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getFilteredProducts = async (params) => {
  const response = await api.get("/products/filter", { params });
  return response.data;
};