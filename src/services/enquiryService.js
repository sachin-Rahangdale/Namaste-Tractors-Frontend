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