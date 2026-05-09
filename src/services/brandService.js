import api from "../api/axios";

// GET /api/brands
export const getBrands = async () => {
  const res = await api.get("/brands");
  return res.data;
};

// POST /api/brands -> Expects JSON body: { "name": "..." }
export const createBrand = async (name) => {
  const res = await api.post("/brands", { name }); 
  return res.data;
};

// PUT /api/brands/{id} -> Expects name as a QUERY PARAMETER
export const updateBrand = async (id, name) => {
  const res = await api.put(`/brands/${id}`, null, {
    params: { name } // This sends ?name=IndoFarm in the URL
  });
  return res.data;
};

// DELETE /api/brands/{id}
export const deleteBrand = async (id) => {
  const res = await api.delete(`/brands/${id}`);
  return res.data;
};