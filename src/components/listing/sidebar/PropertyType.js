// ===============================
// PropertyType.jsx (FIXED)
// Key fixes:
// 1) Uses filterFunctions.propertyTypes (now provided by TopFilterBar)
// 2) Canonizes selections so checked state matches URL values
// 3) Duplex group: checks if ANY duplex variant is selected
// ===============================
"use client";

const DUPLEX_VARIANTS = [
  "Fully-Detached Duplex",
  "Semi-Detached Duplex",
  "Terraced Duplex",
  "Terrace Duplex",
  "Detached Duplex",
  "Contemporary Duplex",
  "Duplex",
];

const CAT_OPTIONS = [
  { kind: "group", value: "duplex", label: "Duplex (all)" },
  { kind: "single", value: "Bungalow", label: "Bungalow" },
  { kind: "single", value: "Apartment", label: "Apartments" },
  { kind: "single", value: "Office", label: "Offices" },
  { kind: "single", value: "Factory", label: "Factory" },
  { kind: "single", value: "Land & Plots", label: "Land & Plots" },
];

export default function PropertyType({ filterFunctions = {} }) {
  const selected = Array.isArray(filterFunctions?.propertyTypes)
    ? filterFunctions.propertyTypes
    : [];

  const setPropertyTypes =
    typeof filterFunctions?.setPropertyTypes === "function"
      ? filterFunctions.setPropertyTypes
      : () => {};

  const selectedSet = new Set(selected.map((s) => String(s).trim()).filter(Boolean));

  const hasAny = (arr) => arr.some((v) => selectedSet.has(v));

  const isAllChecked = selectedSet.size === 0;

  const isDuplexChecked =
    selectedSet.has("duplex") || hasAny(DUPLEX_VARIANTS);

  const toggleDuplex = () => {
    const next = new Set(selectedSet);
    const isOn = next.has("duplex") || DUPLEX_VARIANTS.some((v) => next.has(v));

    if (isOn) {
      next.delete("duplex");
      DUPLEX_VARIANTS.forEach((v) => next.delete(v));
    } else {
      // keep only canonical values; "duplex" token is optional but harmless
      next.add("duplex");
      DUPLEX_VARIANTS.forEach((v) => next.add(v));
    }
    setPropertyTypes(Array.from(next));
  };

  const toggleSingle = (val) => {
    const v = String(val).trim();
    const next = new Set(selectedSet);

    if (next.has(v)) next.delete(v);
    else next.add(v);

    // if user selects any duplex variant manually, also make duplex group appear checked (optional)
    // (we already compute isDuplexChecked from variants anyway)

    setPropertyTypes(Array.from(next));
  };

  return (
    <div>
      <label className="custom_checkbox">
        All
        <input type="checkbox" checked={isAllChecked} onChange={() => setPropertyTypes([])} />
        <span className="checkmark" />
      </label>

      <label className="custom_checkbox" key="duplex">
        Duplex (all)
        <input type="checkbox" checked={isDuplexChecked} onChange={toggleDuplex} />
        <span className="checkmark" />
      </label>

      {CAT_OPTIONS.filter((o) => o.kind === "single").map((opt) => {
        const checked = selectedSet.has(opt.value);
        return (
          <label className="custom_checkbox" key={opt.value}>
            {opt.label}
            <input type="checkbox" checked={checked} onChange={() => toggleSingle(opt.value)} />
            <span className="checkmark" />
          </label>
        );
      })}
    </div>
  );
}
