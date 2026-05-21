import { useEffect, useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import {
  getTractors,
  createTractor,
  updateTractor,
  deleteTractor,
  uploadTractorImage,
  getTractorById,
} from "../../services/tractorService";

import api from "../../api/axios";

import TractorForm from "../../component/admin/TractorForm";
import TractorTable from "../../component/admin/TractorTable";

const EMPTY_SPEC = {
  cylinder: "",
  engineCapacity: "",
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
  liftCapacity: "",
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

const compressImage = async (file) => {
  try {
    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  } catch (err) {
    console.error("Compression error:", err);
    return file;
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
          t.model?.toLowerCase().includes(search.toLowerCase()) ||
          t.brand?.toLowerCase().includes(search.toLowerCase())
      )
    : tractors;

  const handleAdd = async (form, images) => {
    try {
      const payload = {
        model: form.model,
        hp: Number(form.hp),
        price: Number(form.price),
        brandId: Number(form.brandId),
        specification: {
          cylinder: Number(form.specification.cylinder),
          engineCapacity: Number(form.specification.engineCapacity),
          clutch: form.specification.clutch,
          steering: form.specification.steering,
          gearbox: form.specification.gearbox,
          brakes: form.specification.brakes,
          torque: Number(form.specification.torque),
          backupTorque: Number(form.specification.backupTorque),
          ptoHp: form.specification.ptoHp,
          ptoOptions: form.specification.ptoOptions,
          frontTyre: form.specification.frontTyre,
          rearTyre: form.specification.rearTyre,
          rearAxle: form.specification.rearAxle,
          frontAxle: form.specification.frontAxle,
          reduction: form.specification.reduction,
          liftCapacity: Number(form.specification.liftCapacity),
          serviceInterval: Number(form.specification.serviceInterval),
        },
      };

      const tractor = await createTractor(payload);

      for (const img of images) {
        if (img.file) {
          const compressed =
            img.file.size > 300 * 1024
              ? await compressImage(img.file)
              : img.file;

          await uploadTractorImage(tractor.id, compressed, img.type);
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
          const compressed =
            img.file.size > 300 * 1024
              ? await compressImage(img.file)
              : img.file;

          await uploadTractorImage(editTarget.id, compressed, img.type);
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
    <div className="h-full bg-slate-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        
        {/* ── HEADER PANEL BLOCK (PREMIUM CURVES) ────────────────────────────────── */}
        <div className="bg-white border border-gray-200 p-5 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase italic">
              Tractor <span className="text-green-600 NOT-italic">Inventory</span>
            </h1>
            <p className="text-slate-500 mt-1 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Create, update, or sync machine listings parameters
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-[0.98] self-start sm:self-auto"
          >
            + Add Tractor
          </button>
        </div>

        {/* ── SEARCH & FILTER TOOLS METRICS ──────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="w-full md:w-[400px] relative">
            <input
              type="text"
              placeholder="Search by model or brand name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider">
            {filtered.length} matching entries indexed
          </div>
        </div>

        {/* ── CENTRAL DATA GRID MATRIX TABLE ─────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-1 sm:p-2">
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
        </div>

        {/* ── DYNAMIC MODAL INPUT FORMS LAYOUTS ──────────────────────────────────── */}
        {showForm && (
          <TractorForm
            initial={EMPTY_FORM}
            brands={brands}
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
            isEdit={false}
          />
        )}

        {showForm || editTarget ? (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" />
        ) : null}

        {editTarget && (
          <TractorForm
            initial={editTarget}
            brands={brands}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
            isEdit={true}
          />
        )}
      </div>
    </div>
  );
}