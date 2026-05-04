
import api from "../api/axios";

export const getArticles = async (page = 0, size = 10) => {
  try {
    const response = await api.get("/articles", {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

export const getArticleBySlug = async (slug) => {
  try {
    const response = await api.get(`/articles/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching article details:", error);
    throw error;
  }
};