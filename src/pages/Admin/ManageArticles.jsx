import { useCallback, useEffect, useState } from "react";

import {
  getArticles,
} from "../../services/articleService";

import api from "../../api/axios";

import ArticleTable from "../../component/admin/ArticleTable";
import ArticleForm from "../../component/admin/ArticleForm";

export default function ManageArticles() {
  const [articles, setArticles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [showForm, setShowForm] =
    useState(false);

  // ================= LOAD ARTICLES =================
  const loadArticles =
    useCallback(async () => {
      setLoading(true);

      try {
        const data =
          await getArticles(
            page,
            10
          );

        setArticles(
          data.content ?? []
        );

        setTotalPages(
          data.totalPages ?? 1
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, [page]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // ================= SEARCH =================
  const filtered = search
    ? articles.filter((a) =>
        a.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      )
    : articles;

  // ================= CREATE =================
  const handleCreate =
    async (
      form,
      galleryImages
    ) => {
      try {
        // MAIN ARTICLE
        const formData =
          new FormData();

        formData.append(
          "title",
          form.title
        );

        formData.append(
          "content",
          form.content
        );
        formData.append(
          "articleType",
          form.articleType
        );

        formData.append(
          "mainImage",
          form.mainImage
        );

        const createRes =
          await api.post(
            "/articles",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        const articleId =
          createRes.data?.id;

        // GALLERY IMAGES
        if (
          articleId &&
          galleryImages.length >
            0
        ) {
          const galleryForm =
            new FormData();

          galleryImages.forEach(
            (img) => {
              galleryForm.append(
                "images",
                img
              );
            }
          );

          await api.post(
            `/articles/${articleId}/images`,
            galleryForm,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );
        }

        setShowForm(false);

        loadArticles();
      } catch (e) {
        console.error(e);
      }
    };

  // ================= DELETE =================
  const handleDelete =
    async (article) => {
      try {
        await api.delete(
          `/articles/${article.id}`
        );

        loadArticles();
      } catch (e) {
        console.error(e);
      }
    };

  return (
    <div className="h-full bg-[#0b1120] overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tight">
              Article Management
            </h1>

            <p className="text-slate-400 mt-3 text-lg">
              Manage articles and
              news content
            </p>
          </div>

          <button
            onClick={() =>
              setShowForm(true)
            }
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-7 py-4 rounded-2xl font-bold text-lg transition shadow-lg"
          >
            + Add Article
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search article..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full md:w-[420px] bg-[#111827] border border-slate-800 focus:border-yellow-500 outline-none text-white px-5 py-4 rounded-2xl text-lg"
          />

          <div className="flex items-center text-slate-400 text-lg">
            {filtered.length} articles
            found
          </div>
        </div>

        {/* TABLE */}
        <ArticleTable
          articles={filtered}
          loading={loading}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          onDelete={handleDelete}
        />

        {/* FORM */}
        {showForm && (
          <ArticleForm
            onCancel={() =>
              setShowForm(false)
            }
            onSubmit={
              handleCreate
            }
          />
        )}
      </div>
    </div>
  );
}

