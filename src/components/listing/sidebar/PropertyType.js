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

// Show a single “Duplex (all)” option that controls all duplex variants
const CAT_OPTIONS = [
  { kind: "group", value: "duplex", label: "Duplex (all)" },
  { kind: "single", value: "Bungalow", label: "Bungalow" },
  { kind: "single", value: "Apartment", label: "Apartments" },
  // Townhome removed
  { kind: "single", value: "Office", label: "Offices" },
  { kind: "single", value: "Factory", label: "Factory" },
  { kind: "single", value: "Land & Plots", label: "Land & Plots" },
];

export default function PropertyType({ filterFunctions = {} }) {
  const {
    propertyTypes: selected = [],
    setPropertyTypes = () => {},
  } = filterFunctions || {};

  // Helpers
  const hasAny = (arr, set) => arr.some((v) => set.has(v));
  const selectedSet = new Set(Array.isArray(selected) ? selected : []);

  const toggleDuplex = () => {
    const next = new Set(selectedSet);
    const isOn = selectedSet.has("duplex") || hasAny(DUPLEX_VARIANTS, selectedSet);

    if (isOn) {
      // remove group token + every duplex variant
      next.delete("duplex");
      DUPLEX_VARIANTS.forEach((v) => next.delete(v));
    } else {
      // add group token + variants (max compatibility with strict-equality filters)
      next.add("duplex");
      DUPLEX_VARIANTS.forEach((v) => next.add(v));
    }
    setPropertyTypes(Array.from(next));
  };

  const toggleSingle = (val) => {
    const next = new Set(selectedSet);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    setPropertyTypes(Array.from(next));
  };

  const isAllChecked = selectedSet.size === 0;

  const isDuplexChecked =
    selectedSet.has("duplex") || DUPLEX_VARIANTS.some((v) => selectedSet.has(v));

  return (
    <div>
      {/* All */}
      <label className="custom_checkbox">
        All
        <input type="checkbox" checked={isAllChecked} onChange={() => setPropertyTypes([])} />
        <span className="checkmark" />
      </label>

      {/* Duplex group */}
      <label className="custom_checkbox" key="duplex">
        Duplex (all)
        <input type="checkbox" checked={isDuplexChecked} onChange={toggleDuplex} />
        <span className="checkmark" />
      </label>

      {/* Singles */}
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
