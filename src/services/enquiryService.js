import api from "../api/axios";

export const registerEnquiry = async (enquiryData) => {
  try {
    const response = await api.post("/enquiries", enquiryData);
    return response.data;
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    throw error;
  }
};


export const getEnquiries = async () => {
  const res = await api.get("/enquiries");
  return res.data; // This returns the array directly as per your Swagger
};

export const updateEnquiryStatus = async (id, progress) => {
  // Query param structure: /api/enquiries/{id}/status?progress=...
  const res = await api.put(`/enquiries/${id}/status`, null, {
    params: { progress }
  });
  return res.data;
};

export const deleteEnquiry = async (id) => {
  const res = await api.delete(`/enquiries/${id}`);
  return res.data;
};