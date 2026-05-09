import { useState, useEffect, useCallback, useRef } from "react";
import {
  getTractors,
  createTractor,
  updateTractor,
  deleteTractor,
  uploadTractorImage,
  getTractorById,
} from "../../services/tractorService";

// ─── Brand stub – replace with your real getBrands API ───────────────────────
import api from "../../api/axios";
const getBrands = async () => {
  try {
    const res = await api.get("/brands");
    return res.data?.content ?? res.data ?? [];
  } catch {
    return [];
  }
};

// ─── Constants ────────────────────────────────────────────────────────────────
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
  serviceInterval: "",
};

const EMPTY_FORM = {
  model: "",
  hp: "",
  price: "",
  brandId: "",
  specification: { ...EMPTY_SPEC },
};

const IMAGE_TYPES = ["MAIN", "GALLERY"];

const SPEC_FIELDS = [
  { key: "cylinder", label: "Cylinders", type: "number" },
  { key: "engineCapacity", label: "Engine Capacity (cc)", type: "number" },
  { key: "clutch", label: "Clutch", type: "text" },
  { key: "steering", label: "Steering", type: "text" },
  { key: "gearbox", label: "Gearbox", type: "text" },
  { key: "brakes", label: "Brakes", type: "text" },
  { key: "torque", label: "Torque (Nm)", type: "number" },
  { key: "backupTorque", label: "Backup Torque (Nm)", type: "number" },
  { key: "ptoHp", label: "PTO HP", type: "text" },
  { key: "ptoOptions", label: "PTO Options", type: "text" },
  { key: "frontTyre", label: "Front Tyre", type: "text" },
  { key: "rearTyre", label: "Rear Tyre", type: "text" },
  { key: "rearAxle", label: "Rear Axle", type: "text" },
  { key: "frontAxle", label: "Front Axle", type: "text" },
  { key: "reduction", label: "Reduction", type: "text" },
  { key: "serviceInterval", label: "Service Interval (hrs)", type: "number" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toNum = (v) => (v === "" ? undefined : Number(v));

function buildPayload(form) {
  const spec = {};
  SPEC_FIELDS.forEach(({ key, type }) => {
    const v = form.specification[key];
    spec[key] = type === "number" ? toNum(v) : v || undefined;
  });
  return {
    model: form.model,
    hp: toNum(form.hp),
    price: toNum(form.price),
    brandId: toNum(form.brandId),
    specification: spec,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toast({ toasts }) {
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          {t.type === "success" ? "✓" : "✕"} {t.message}
        </div>
      ))}
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn--danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageUploadPanel({ images, onChange }) {
  const inputRef = useRef();

  const handleFiles = (files) => {
    const newImgs = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: "MAIN",
      id: Math.random().toString(36).slice(2),
    }));
    onChange([...images, ...newImgs]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const setType = (id, type) =>
    onChange(images.map((img) => (img.id === id ? { ...img, type } : img)));

  const remove = (id) => onChange(images.filter((img) => img.id !== id));

  return (
    <div className="image-panel">
      <div
        className="drop-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
      >
        <span className="drop-icon">⬆</span>
        <span>Drop images here or click to browse</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="image-grid">
          {images.map((img) => (
            <div key={img.id} className="image-card">
              <img
                src={img.preview || img.imageUrl}
                alt="preview"
                className="image-thumb"
              />
              <select
                className="type-select"
                value={img.type}
                onChange={(e) => setType(img.id, e.target.value)}
              >
                {IMAGE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="img-remove"
                onClick={() => remove(img.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TractorForm({ initial, brands, onSubmit, onCancel, isEdit }) {
  const [form, setForm] = useState(initial);
  const [images, setImages] = useState(
    // For edit, show existing images as previews (non-uploadable)
    (initial._existingImages ?? []).map((img) => ({
      ...img,
      id: Math.random().toString(36).slice(2),
      preview: img.imageUrl,
      existing: true,
    }))
  );
  const [newImages, setNewImages] = useState([]);
  const [step, setStep] = useState(1); // 1 = basic+spec, 2 = images
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const setSpec = (key, value) =>
    setForm((f) => ({
      ...f,
      specification: { ...f.specification, [key]: value },
    }));

  const validate = () => {
    const e = {};
    if (!form.model.trim()) e.model = "Model is required";
    if (!form.hp) e.hp = "HP is required";
    if (!form.price) e.price = "Price is required";
    if (!form.brandId) e.brandId = "Brand is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form, newImages);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="overlay" onClick={onCancel}>
      <div
        className="drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="drawer-header">
          <div>
            <div className="drawer-title">
              {isEdit ? "Edit Tractor" : "Add New Tractor"}
            </div>
            <div className="step-indicator">
              <span className={step === 1 ? "step active" : "step"}>
                1 · Details & Specs
              </span>
              <span className="step-sep">›</span>
              <span className={step === 2 ? "step active" : "step"}>
                2 · Images
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onCancel}>
            ✕
          </button>
        </div>

        <div className="drawer-body">
          {step === 1 && (
            <>
              {/* Basic Info */}
              <section className="form-section">
                <h3 className="section-title">Basic Information</h3>
                <div className="form-grid">
                  <div className="field">
                    <label>Model *</label>
                    <input
                      className={errors.model ? "input error" : "input"}
                      value={form.model}
                      onChange={(e) => set("model", e.target.value)}
                      placeholder="e.g. Mahindra 575 DI"
                    />
                    {errors.model && (
                      <span className="err-msg">{errors.model}</span>
                    )}
                  </div>
                  <div className="field">
                    <label>Brand *</label>
                    <select
                      className={errors.brandId ? "input error" : "input"}
                      value={form.brandId}
                      onChange={(e) => set("brandId", e.target.value)}
                    >
                      <option value="">Select brand</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    {errors.brandId && (
                      <span className="err-msg">{errors.brandId}</span>
                    )}
                  </div>
                  <div className="field">
                    <label>HP *</label>
                    <input
                      className={errors.hp ? "input error" : "input"}
                      type="number"
                      value={form.hp}
                      onChange={(e) => set("hp", e.target.value)}
                      placeholder="e.g. 45"
                    />
                    {errors.hp && (
                      <span className="err-msg">{errors.hp}</span>
                    )}
                  </div>
                  <div className="field">
                    <label>Price (₹) *</label>
                    <input
                      className={errors.price ? "input error" : "input"}
                      type="number"
                      value={form.price}
                      onChange={(e) => set("price", e.target.value)}
                      placeholder="e.g. 750000"
                    />
                    {errors.price && (
                      <span className="err-msg">{errors.price}</span>
                    )}
                  </div>
                </div>
              </section>

              {/* Specifications */}
              <section className="form-section">
                <h3 className="section-title">Technical Specifications</h3>
                <div className="form-grid form-grid--3">
                  {SPEC_FIELDS.map(({ key, label, type }) => (
                    <div className="field" key={key}>
                      <label>{label}</label>
                      <input
                        className="input"
                        type={type}
                        value={form.specification[key]}
                        onChange={(e) => setSpec(key, e.target.value)}
                        placeholder={type === "number" ? "0" : "—"}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {step === 2 && (
            <section className="form-section">
              <h3 className="section-title">
                {isEdit
                  ? "Upload New Images"
                  : "Upload Images"}
              </h3>
              {isEdit && images.length > 0 && (
                <>
                  <p className="hint-text">Existing images (read-only)</p>
                  <div className="image-grid">
                    {images.map((img) => (
                      <div key={img.id} className="image-card image-card--existing">
                        <img
                          src={img.preview}
                          alt="existing"
                          className="image-thumb"
                        />
                        <span className="type-badge">{img.imageType}</span>
                      </div>
                    ))}
                  </div>
                  <div className="section-divider" />
                  <p className="hint-text">Add more images</p>
                </>
              )}
              <ImageUploadPanel images={newImages} onChange={setNewImages} />
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          {step === 1 ? (
            <>
              <button className="btn btn--ghost" onClick={onCancel}>
                Cancel
              </button>
              <button className="btn btn--primary" onClick={() => setStep(2)}>
                Next: Images →
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn--ghost"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button
                className="btn btn--primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting
                  ? "Saving…"
                  : isEdit
                    ? "Save Changes"
                    : "Add Tractor"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ManageTractors() {
  const [tractors, setTractors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // tractor object for editing
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toasts, setToasts] = useState([]);
  const toastCounter = useRef(0);

  const toast = useCallback((message, type = "success") => {
    const id = ++toastCounter.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTractors(page, 10);
      setTractors(data.content ?? data ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      toast("Failed to load tractors", "error");
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    getBrands().then(setBrands);
  }, []);

  const brandName = (id) =>
    brands.find((b) => String(b.id) === String(id))?.name ?? "—";

  const filtered = search
    ? tractors.filter(
      (t) =>
        t.model?.toLowerCase().includes(search.toLowerCase()) ||
        t.brand?.toLowerCase().includes(search.toLowerCase())
    )
    : tractors;

  // ── Add ──────────────────────────────────────────────────────────────────
  const handleAdd = async (form, newImages) => {
    try {
      const tractor = await createTractor(buildPayload(form));
      // Upload images after creation using the returned id
      await uploadImages(tractor.id, newImages);
      toast(`Tractor "${tractor.model}" added successfully`);
      setShowForm(false);
      load();
    } catch (err) {
      toast(
        err?.response?.data?.message ?? "Failed to add tractor",
        "error"
      );
      throw err;
    }
  };

  // ── Edit ─────────────────────────────────────────────────────────────────
  const openEdit = async (tractor) => {
    try {
      // Fetch full details to prefill all spec fields
      const full = await getTractorById(tractor.id);
      setEditTarget(full);
    } catch {
      toast("Could not load tractor details", "error");
    }
  };

  const handleEdit = async (form, newImages) => {
    try {
      await updateTractor(editTarget.id, buildPayload(form));
      if (newImages.length > 0) {
        await uploadImages(editTarget.id, newImages);
      }
      toast(`Tractor "${form.model}" updated successfully`);
      setEditTarget(null);
      load();
    } catch (err) {
      toast(
        err?.response?.data?.message ?? "Failed to update tractor",
        "error"
      );
      throw err;
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      await deleteTractor(deleteTarget.id);
      toast(`Tractor "${deleteTarget.model}" deleted`);
      setDeleteTarget(null);
      load();
    } catch {
      toast("Failed to delete tractor", "error");
    }
  };

  // ── Image upload helper ───────────────────────────────────────────────────
  const uploadImages = async (tractorId, images) => {
    for (const img of images) {
      if (img.file) {
        await uploadTractorImage(tractorId, img.file, img.type);
      }
    }
  };

  // ── Build initial form for edit ──────────────────────────────────────────
  const editInitial = editTarget
    ? {
      model: editTarget.model ?? "",
      hp: editTarget.hp ?? "",
      price: editTarget.price ?? "",
      brandId: editTarget.brandId ?? "",
      specification: {
        cylinder: editTarget.specification?.cylinder ?? "",
        engineCapacity: editTarget.specification?.engineCapacity ?? "",
        clutch: editTarget.specification?.clutch ?? "",
        steering: editTarget.specification?.steering ?? "",
        gearbox: editTarget.specification?.gearbox ?? "",
        brakes: editTarget.specification?.brakes ?? "",
        torque: editTarget.specification?.torque ?? "",
        backupTorque: editTarget.specification?.backupTorque ?? "",
        ptoHp: editTarget.specification?.ptoHp ?? "",
        ptoOptions: editTarget.specification?.ptoOptions ?? "",
        frontTyre: editTarget.specification?.frontTyre ?? "",
        rearTyre: editTarget.specification?.rearTyre ?? "",
        rearAxle: editTarget.specification?.rearAxle ?? "",
        frontAxle: editTarget.specification?.frontAxle ?? "",
        reduction: editTarget.specification?.reduction ?? "",
        serviceInterval: editTarget.specification?.serviceInterval ?? "",
      },
      _existingImages: editTarget.images ?? [],
    }
    : null;

  return (
    <>
      <style>{styles}</style>
      <Toast toasts={toasts} />

      <div className="page">
        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <span className="logo-icon">🚜</span>
            <div>
              <h1 className="page-title">Tractor Management</h1>
              <p className="page-sub">
                {tractors.length} tractors in inventory
              </p>
            </div>
          </div>
          <button className="btn btn--primary" onClick={() => setShowForm(true)}>
            + Add Tractor
          </button>
        </header>

        {/* Search & filters bar */}
        <div className="toolbar">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              className="search-input"
              placeholder="Search by model or brand…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="result-count">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div className="table-wrap">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              Loading tractors…
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🚜</span>
              <p>No tractors found.</p>
              <button
                className="btn btn--primary"
                onClick={() => setShowForm(true)}
              >
                Add your first tractor
              </button>
            </div>
          ) : (
            <table className="tractor-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Brand</th>
                  <th>HP</th>
                  <th>Price</th>
                  <th>Cylinders</th>
                  <th>Engine (cc)</th>
                  <th>Images</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const mainImg = t.images?.find(
                    (i) => i.imageType === "MAIN"
                  );
                  return (
                    <tr key={t.id}>
                      <td>
                        <div className="model-cell">
                          {mainImg ? (
                            <img
                              src={mainImg.imageUrl}
                              alt={t.model}
                              className="row-thumb"
                            />
                          ) : (
                            <div className="row-thumb row-thumb--placeholder">
                              🚜
                            </div>
                          )}
                          <span className="model-name">{t.model}</span>
                        </div>
                      </td>
                      <td>
                        <span className="brand-badge">
                          {t.brand ?? brandName(t.brandId)}
                        </span>
                      </td>
                      <td>
                        <span className="hp-pill">{t.hp} HP</span>
                      </td>
                      <td>
                        ₹{Number(t.price ?? 0).toLocaleString("en-IN")}
                      </td>
                      <td>{t.specification?.cylinder ?? "—"}</td>
                      <td>{t.specification?.engineCapacity ?? "—"}</td>
                      <td>
                        <span className="img-count">
                          {t.images?.length ?? 0} photo
                          {(t.images?.length ?? 0) !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="icon-btn icon-btn--edit"
                            title="Edit"
                            onClick={() => openEdit(t)}
                          >
                            ✎
                          </button>
                          <button
                            className="icon-btn icon-btn--delete"
                            title="Delete"
                            onClick={() => setDeleteTarget(t)}
                          >
                            ⌫
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn btn--ghost btn--sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-num ${i === page ? "active" : ""}`}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn btn--ghost btn--sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Add Form */}
      {showForm && (
        <TractorForm
          initial={{ ...EMPTY_FORM, _existingImages: [] }}
          brands={brands}
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
          isEdit={false}
        />
      )}

      {/* Edit Form */}
      {editTarget && editInitial && (
        <TractorForm
          initial={editInitial}
          brands={brands}
          onSubmit={handleEdit}
          onCancel={() => setEditTarget(null)}
          isEdit={true}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Delete "${deleteTarget.model}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f1117;
    --surface: #181c27;
    --surface2: #1f2435;
    --border: #2a2f45;
    --accent: #f5a623;
    --accent-dim: rgba(245,166,35,0.12);
    --danger: #e5534b;
    --danger-dim: rgba(229,83,75,0.12);
    --success: #3fb950;
    --text: #e8eaf0;
    --text-muted: #7b839a;
    --radius: 10px;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
  }

  body { font-family: var(--font-body); background: var(--bg); color: var(--text); }

  /* ─ Page ─ */
  .page {
    min-height: 100vh;
    padding: 32px;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* ─ Topbar ─ */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }
  .topbar-left { display: flex; align-items: center; gap: 16px; }
  .logo-icon { font-size: 2.5rem; }
  .page-title {
    font-family: var(--font-head);
    font-size: 1.8rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #fff;
  }
  .page-sub { font-size: 0.85rem; color: var(--text-muted); margin-top: 2px; }

  /* ─ Toolbar ─ */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }
  .search-wrap {
    position: relative;
    flex: 1;
    max-width: 400px;
  }
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 1.1rem;
  }
  .search-input {
    width: 100%;
    padding: 10px 14px 10px 36px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 0.9rem;
    transition: border-color 0.2s;
  }
  .search-input:focus { outline: none; border-color: var(--accent); }
  .result-count { font-size: 0.85rem; color: var(--text-muted); margin-left: auto; }

  /* ─ Table ─ */
  .table-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow-x: auto;
  }
  .tractor-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }
  .tractor-table thead tr {
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
  }
  .tractor-table th {
    padding: 14px 16px;
    text-align: left;
    font-family: var(--font-head);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
    white-space: nowrap;
  }
  .tractor-table td {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }
  .tractor-table tr:last-child td { border-bottom: none; }
  .tractor-table tbody tr:hover { background: var(--surface2); }

  .model-cell { display: flex; align-items: center; gap: 10px; }
  .row-thumb {
    width: 44px;
    height: 36px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid var(--border);
    flex-shrink: 0;
  }
  .row-thumb--placeholder {
    background: var(--surface2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }
  .model-name { font-weight: 500; color: #fff; }

  .brand-badge {
    background: var(--accent-dim);
    color: var(--accent);
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 500;
  }
  .hp-pill {
    background: rgba(63,185,80,0.12);
    color: var(--success);
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 500;
  }
  .img-count { color: var(--text-muted); font-size: 0.82rem; }

  /* ─ Action buttons ─ */
  .action-btns { display: flex; gap: 6px; }
  .icon-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, transform 0.1s;
  }
  .icon-btn:hover { transform: scale(1.1); }
  .icon-btn--edit { background: var(--accent-dim); color: var(--accent); }
  .icon-btn--edit:hover { background: rgba(245,166,35,0.25); }
  .icon-btn--delete { background: var(--danger-dim); color: var(--danger); }
  .icon-btn--delete:hover { background: rgba(229,83,75,0.25); }

  /* ─ Buttons ─ */
  .btn {
    font-family: var(--font-head);
    font-size: 0.88rem;
    font-weight: 700;
    padding: 10px 20px;
    border-radius: var(--radius);
    border: none;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s, background 0.15s;
  }
  .btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn--primary { background: var(--accent); color: #000; }
  .btn--ghost {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border);
  }
  .btn--ghost:hover:not(:disabled) { color: var(--text); border-color: var(--text-muted); }
  .btn--danger { background: var(--danger); color: #fff; }
  .btn--sm { padding: 7px 14px; font-size: 0.8rem; }

  /* ─ States ─ */
  .loading-state, .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 80px 20px;
    color: var(--text-muted);
  }
  .empty-icon { font-size: 3rem; }
  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ─ Pagination ─ */
  .pagination {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
    margin-top: 24px;
  }
  .page-num {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-muted);
    cursor: pointer;
    font-family: var(--font-head);
    font-size: 0.85rem;
    transition: all 0.15s;
  }
  .page-num:hover { border-color: var(--accent); color: var(--accent); }
  .page-num.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #000;
    font-weight: 700;
  }

  /* ─ Overlay / Drawer ─ */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.65);
    z-index: 100;
    display: flex;
    justify-content: flex-end;
    backdrop-filter: blur(3px);
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

  .drawer {
    width: min(640px, 100vw);
    height: 100vh;
    background: var(--surface);
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    animation: slideIn 0.25s cubic-bezier(0.22,1,0.36,1);
  }
  @keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }

  .drawer-header {
    padding: 24px 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-shrink: 0;
  }
  .drawer-title {
    font-family: var(--font-head);
    font-size: 1.3rem;
    font-weight: 800;
    color: #fff;
  }
  .step-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
  }
  .step {
    font-size: 0.78rem;
    color: var(--text-muted);
    font-family: var(--font-head);
  }
  .step.active { color: var(--accent); font-weight: 700; }
  .step-sep { color: var(--border); font-size: 0.8rem; }

  .close-btn {
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text-muted);
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .close-btn:hover { color: var(--text); border-color: var(--text-muted); }

  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px 28px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .drawer-footer {
    padding: 20px 28px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    flex-shrink: 0;
    background: var(--surface);
  }

  /* ─ Form ─ */
  .form-section { margin-bottom: 32px; }
  .section-title {
    font-family: var(--font-head);
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--accent);
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .form-grid--3 {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 520px) {
    .form-grid, .form-grid--3 { grid-template-columns: 1fr; }
  }

  .field { display: flex; flex-direction: column; gap: 5px; }
  .field label {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.03em;
  }

  .input {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 9px 12px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 0.88rem;
    transition: border-color 0.2s;
    width: 100%;
  }
  .input:focus { outline: none; border-color: var(--accent); }
  .input.error { border-color: var(--danger); }
  .err-msg { font-size: 0.75rem; color: var(--danger); }

  /* ─ Image Upload ─ */
  .image-panel { display: flex; flex-direction: column; gap: 16px; }
  .drop-zone {
    border: 2px dashed var(--border);
    border-radius: var(--radius);
    padding: 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 0.9rem;
    transition: border-color 0.2s, background 0.2s;
  }
  .drop-zone:hover {
    border-color: var(--accent);
    background: var(--accent-dim);
    color: var(--accent);
  }
  .drop-icon { font-size: 2rem; }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
  .image-card {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border);
    background: var(--surface2);
  }
  .image-card--existing { opacity: 0.7; }
  .image-thumb {
    width: 100%;
    height: 90px;
    object-fit: cover;
    display: block;
  }
  .type-select {
    width: 100%;
    background: var(--surface2);
    border: none;
    border-top: 1px solid var(--border);
    color: var(--text);
    font-size: 0.75rem;
    padding: 4px 8px;
    font-family: var(--font-body);
    cursor: pointer;
  }
  .type-badge {
    display: block;
    width: 100%;
    background: var(--accent-dim);
    color: var(--accent);
    font-size: 0.72rem;
    padding: 3px 8px;
    text-align: center;
    border-top: 1px solid var(--border);
    font-family: var(--font-head);
    font-weight: 700;
  }
  .img-remove {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(0,0,0,0.65);
    border: none;
    color: #fff;
    font-size: 0.7rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }
  .img-remove:hover { background: var(--danger); }

  .hint-text { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px; }
  .section-divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 18px 0;
  }

  /* ─ Confirm dialog ─ */
  .confirm-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px 32px;
    max-width: 400px;
    width: 90vw;
    margin: auto;
    box-shadow: var(--shadow);
    animation: popIn 0.2s cubic-bezier(0.22,1,0.36,1);
  }
  .overlay { align-items: center; justify-content: center; }
  @keyframes popIn { from { transform: scale(0.92); opacity: 0 } to { transform: scale(1); opacity: 1 } }
  .confirm-box p { color: var(--text); font-size: 0.95rem; line-height: 1.5; margin-bottom: 20px; }
  .confirm-actions { display: flex; gap: 10px; justify-content: flex-end; }

  /* ─ Toast ─ */
  .toast-stack {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .toast {
    padding: 12px 18px;
    border-radius: var(--radius);
    font-size: 0.88rem;
    font-family: var(--font-body);
    font-weight: 500;
    box-shadow: var(--shadow);
    animation: toastIn 0.25s ease;
    max-width: 320px;
  }
  @keyframes toastIn { from { transform: translateX(20px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
  .toast--success { background: rgba(63,185,80,0.15); border: 1px solid var(--success); color: var(--success); }
  .toast--error { background: var(--danger-dim); border: 1px solid var(--danger); color: var(--danger); }
`;