"use client";
import { useEffect, useMemo, useState } from "react";

export default function Amenities({ groups = [], selected = [], onChange }) {
  // Canonicalize labels (trim + collapse spaces)
  const canon = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
  const keyOf = (s) => canon(s).toLowerCase();

  // Local mirror so UI updates instantly
  const [localSelected, setLocalSelected] = useState(() =>
    Array.isArray(selected) ? selected.map(canon) : []
  );

  // Keep local in sync with parent
  useEffect(() => {
    if (Array.isArray(selected)) {
      const next = selected.map(canon);
      // Avoid unnecessary state churn
      const a = next.join("|");
      const b = localSelected.join("|");
      if (a !== b) setLocalSelected(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // Case-insensitive membership
  const selectedKeySet = useMemo(() => {
    const s = new Set();
    for (let i = 0; i < localSelected.length; i++) s.add(keyOf(localSelected[i]));
    return s;
  }, [localSelected]);

  // Deduplicate items within each group (case-insensitive) while preserving first casing
  const dedupedGroups = useMemo(() => {
    if (!Array.isArray(groups)) return [];
    return groups.map((g, gi) => {
      const seen = new Set();
      const items = [];
      const rawItems = Array.isArray(g?.items) ? g.items : [];
      for (let i = 0; i < rawItems.length; i++) {
        const disp = canon(rawItems[i]);
        if (!disp) continue;
        const k = keyOf(disp);
        if (!seen.has(k)) {
          seen.add(k);
          items.push(disp);
        }
      }
      return { title: g?.title || `Amenities ${gi + 1}`, items };
    });
  }, [groups]);

  const commit = (next) => {
    setLocalSelected(next);
    onChange?.(next); // parent will re-run filtering
  };

  const toggle = (label) => {
    const k = keyOf(label);
    if (selectedKeySet.has(k)) {
      // remove any entry that matches key-insensitively
      commit(localSelected.filter((x) => keyOf(x) !== k));
    } else {
      commit([...localSelected, canon(label)]);
    }
  };

  const onKeyToggle = (e, label) => {
    if (e.key === " " || e.key === "Spacebar" || e.key === "Enter") {
      e.preventDefault();
      toggle(label);
    }
  };

  if (!dedupedGroups.length) return null;

  return (
    <>
      {dedupedGroups.map((g, gi) => (
        <div className="col-sm-4" key={`amenity-group-${gi}`}>
          <div className="widget-wrapper mb20">
            <div className="fw600 mb10">{g.title}</div>
            <div className="checkbox-style1">
              {g.items.map((label, i) => {
                const id = `amenity-${gi}-${i}`;
                const checked = selectedKeySet.has(keyOf(label));
                return (
                  <label
                    key={id}
                    className={`custom_checkbox${checked ? " is-checked" : ""}`}
                    htmlFor={id}
                    // Ensure click always toggles (some themes hide the input)
                    onClick={(e) => {
                      e.preventDefault();
                      toggle(label);
                    }}
                    onKeyDown={(e) => onKeyToggle(e, label)}
                    role="checkbox"
                    aria-checked={checked}
                    tabIndex={0}
                    style={{ cursor: "pointer" }}
                  >
                    {label}
                    {/* Keep a real input for a11y/CSS, but make it inert to avoid theme interference */}
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(label)}
                      aria-hidden="true"
                      tabIndex={-1}
                      style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
                    />
                    <span className="checkmark" />
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}