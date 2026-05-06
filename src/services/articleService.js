
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


export const getArticleComments = async (id, page = 0, size = 10) => {
  const res = await api.get(`/articles/${id}/comments`, { params: { page, size } });
  return res.data;
};

export const postComment = async (id, commentData) => {
  const res = await api.post(`/articles/${id}/comments`, commentData);
  return res.data;
};

