import { useEffect, useState, useCallback } from "react";

import {
  getTractors,
  createTractor,
  updateTractor,
  deleteTractor,
  uploadTractorImage,
  getTractorById,
} from "../../services/tractorService";

import api from "../../api/axios";


import TractorTable from "../../component/admin/TractorTable";
import TractorForm from "../../component/admin/TractorForm";

const EMPTY_SPEC = {
  clutch: "",
  steering: "",
  gearbox: "",
  brakes: "",
  torque: "",
  backupTorque: "",
  ptoHp: "",
  ptoOptions: "",
  frontTyre: "",
  rearTyre: "",
  rearAxle: "",
  frontAxle: "",
  reduction: "",
  serviceInterval: "",
};

const EMPTY_FORM = {
  model: "",
  hp: "",
  price: "",
  brandId: "",
  specification: { ...EMPTY_SPEC },
};

const getBrands = async () => {
  try {
    const res = await api.get("/brands");
    return res.data?.content ?? res.data ?? [];
  } catch {
    return [];
  }
};

export default function ManageTractors() {
  const [tractors, setTractors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);

  const [editTarget, setEditTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getTractors(page, 10);

      setTractors(data.content ?? data ?? []);

      setTotalPages(data.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    getBrands().then(setBrands);
  }, []);

  const filtered = search
    ? tractors.filter(
        (t) =>
          t.model
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          t.brand
            ?.toLowerCase()
            .includes(search.toLowerCase())
      )
    : tractors;

  const handleAdd = async (form, images) => {
    try {
      const tractor = await createTractor(form);

      for (const img of images) {
        if (img.file) {
          await uploadTractorImage(
            tractor.id,
            img.file,
            img.type
          );
        }
      }

      setShowForm(false);

      load();
    } catch (e) {
      console.error(e);
    }
  };

  const openEdit = async (tractor) => {
    try {
      const full = await getTractorById(tractor.id);

      setEditTarget(full);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = async (form, images) => {
    try {
      await updateTractor(editTarget.id, form);

      for (const img of images) {
        if (img.file) {
          await uploadTractorImage(
            editTarget.id,
            img.file,
            img.type
          );
        }
      }

      setEditTarget(null);

      load();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (tractor) => {
    try {
      await deleteTractor(tractor.id);

      load();
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
              Tractor Management
            </h1>

            <p className="text-slate-400 mt-3 text-lg">
              Manage tractor inventory
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-7 py-4 rounded-2xl font-bold text-lg transition shadow-lg"
          >
            + Add Tractor
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by model or brand..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full md:w-[420px] bg-[#111827] border border-slate-800 focus:border-yellow-500 outline-none text-white px-5 py-4 rounded-2xl text-lg"
          />

          <div className="flex items-center text-slate-400 text-lg">
            {filtered.length} tractors found
          </div>
        </div>

        {/* TABLE */}
        <TractorTable
          tractors={filtered}
          loading={loading}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          onEdit={openEdit}
          onDelete={handleDelete}
          brands={brands}
        />

        {/* ADD */}
        {showForm && (
          <TractorForm
            initial={EMPTY_FORM}
            brands={brands}
            onSubmit={handleAdd}
            onCancel={() =>
              setShowForm(false)
            }
            isEdit={false}
          />
        )}

        {/* EDIT */}
        {editTarget && (
          <TractorForm
            initial={editTarget}
            brands={brands}
            onSubmit={handleEdit}
            onCancel={() =>
              setEditTarget(null)
            }
            isEdit={true}
          />
        )}
      </div>
    </div>
  );
}

