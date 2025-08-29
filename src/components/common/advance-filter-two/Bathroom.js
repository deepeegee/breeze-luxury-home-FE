"use client";

const Bathroom = ({ filterFunctions }) => {
  const bathOptions = [
    { id: "yany", label: "any", value: 0 },
    { id: "yoneplus", label: "1+", value: 1 },
    { id: "ytwoplus", label: "2+", value: 2 },
    { id: "ythreeplus", label: "3+", value: 3 },
    { id: "yfourplus", label: "4+", value: 4 },
    { id: "yfiveplus", label: "5+", value: 5 },
  ];

  const current = Number(filterFunctions?.bathroms ?? filterFunctions?.bathrooms ?? 0);

  const setBaths = (val) => {
    if (typeof filterFunctions?.handlebathroms === "function") filterFunctions.handlebathroms(val);
    else if (typeof filterFunctions?.handlebathrooms === "function") filterFunctions.handlebathrooms(val);
  };

  return (
    <>
      {bathOptions.map((option) => (
        <div className="selection" key={option.id}>
          <input
            id={option.id}
            name="bathrooms"
            type="radio"
            value={option.value}
            checked={current === option.value}
            onChange={() => {
              setBaths(option.value);
              filterFunctions?.onFiltersChanged?.();
            }}
          />
          <label htmlFor={option.id}>{option.label}</label>
        </div>
      ))}
    </>
  );
};

export default Bathroom;
