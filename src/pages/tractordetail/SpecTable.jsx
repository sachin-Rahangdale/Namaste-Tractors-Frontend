import React from "react";

/* ─── Section config ─────────────────────────────────────────────────────────── */
const SECTIONS = [
  {
    id: "engine",
    label: "Engine",
    emoji: "⚙️",
    header: "bg-emerald-700",
    stripe: "bg-emerald-50/50",
  },
  {
    id: "transmission",
    label: "Transmission",
    emoji: "🔧",
    header: "bg-sky-700",
    stripe: "bg-sky-50/50",
  },
  {
    id: "chassis",
    label: "Chassis",
    emoji: "🛞",
    header: "bg-orange-600",
    stripe: "bg-orange-50/50",
  },
  {
    id: "tyres",
    label: "Tyres & Dimensions",
    emoji: "🔵",
    header: "bg-stone-700",
    stripe: "bg-stone-50/60",
  },
];

const buildRows = (spec, tractor) => ({
  engine: [
    { label: "Horsepower",       value: tractor.hp ? `${tractor.hp} HP` : null },
    { label: "Cylinders",        value: spec.cylinder },
    { label: "Displacement",     value: spec.engineCapacity ? `${spec.engineCapacity} cc` : null },
    { label: "Max Torque",       value: spec.torque ? `${spec.torque} Nm` : null },
    { label: "Backup Torque",    value: spec.backupTorque ? `${spec.backupTorque}%` : null },
    { label: "Service Interval", value: spec.serviceInterval ? `Every ${spec.serviceInterval} hrs` : null },
  ],
  transmission: [
    { label: "Clutch Type",      value: spec.clutch },
    { label: "Gearbox",          value: spec.gearbox },
    { label: "PTO Horsepower",   value: spec.ptoHp ? `${spec.ptoHp} HP` : null },
    { label: "PTO Options",      value: spec.ptoOptions },
    { label: "Final Reduction",  value: spec.reduction },
  ],
  chassis: [
    { label: "Steering System",  value: spec.steering },
    { label: "Braking System",   value: spec.brakes },
    { label: "Front Axle",       value: spec.frontAxle },
    { label: "Rear Axle",        value: spec.rearAxle },
    { label: "Lifting Capacity", value: spec.liftCapacity ? `${spec.liftCapacity} kg` : null },
  ],
  tyres: [
    { label: "Front Tyre",       value: spec.frontTyre },
    { label: "Rear Tyre",        value: spec.rearTyre },
    { label: "Drive Type",       value: spec.wheelDrive },
  ],
});

/* ─── Single section table ───────────────────────────────────────────────────── */
const SpecSection = ({ section, rows }) => {
  if (rows.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      {/* Colored header */}
      <div className={`${section.header} px-5 py-3.5 flex items-center gap-2`}>
        <span className="text-lg">{section.emoji}</span>
        <span className="text-white font-black text-sm uppercase tracking-widest">
          {section.label}
        </span>
      </div>

      {/* Column headings */}
      <div className="grid grid-cols-2 bg-stone-50 border-b border-stone-200 px-5 py-2.5">
        <span className="text-[11px] font-black text-stone-400 uppercase tracking-widest">Parameter</span>
        <span className="text-[11px] font-black text-stone-400 uppercase tracking-widest text-right">Value</span>
      </div>

      {/* Rows */}
      <table className="w-full border-collapse">
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-stone-100 last:border-0 ${
                i % 2 !== 0 ? section.stripe : "bg-white"
              }`}
            >
              <td className="px-5 py-3.5 text-sm font-semibold text-stone-600 w-1/2">
                {row.label}
              </td>
              <td className="px-5 py-3.5 text-sm font-black text-stone-900 text-right w-1/2">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ─── SpecTable Component ────────────────────────────────────────────────────── */
const SpecTable = ({ tractor }) => {
  const spec = tractor?.specification || {};
  const allRows = buildRows(spec, tractor);

  return (
    <section id="specs" className="space-y-5">
      {/* Heading */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
          Specifications
        </h2>
        <p className="text-xs text-stone-500 mt-0.5 font-medium">
          Technical breakdown by category
        </p>
      </div>

      {/* Stacked sections */}
      {SECTIONS.map(section => (
        <SpecSection
          key={section.id}
          section={section}
          rows={allRows[section.id].filter(r => r.value != null && r.value !== "")}
        />
      ))}

      <p className="text-[11px] text-stone-400 font-medium px-1">
        * Specs may vary by variant and region. Verify with your nearest dealer.
      </p>
    </section>
  );
};

export default SpecTable;