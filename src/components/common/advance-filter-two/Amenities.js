"use client";

export default function Amenities({
  groups = [],
  selected = [],
  onChange,
}) {
  const toggle = (label) => {
    const has = selected.includes(label);
    const next = has ? selected.filter((x) => x !== label) : [...selected, label];
    onChange(next);
  };

  if (!groups.length) return null;

  return (
    <>
      {groups.map((g, gi) => (
        <div className="col-sm-4" key={`amenity-group-${gi}`}>
          <div className="widget-wrapper mb20">
            <div className="fw600 mb10">{g.title}</div>
            <div className="checkbox-style1">
              {g.items.map((label, i) => (
                <label className="custom_checkbox" key={`${g.title}-${label}-${i}`}>
                  {label}
                  <input
                    type="checkbox"
                    checked={selected.includes(label)}
                    onChange={() => toggle(label)}
                  />
                  <span className="checkmark" />
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
