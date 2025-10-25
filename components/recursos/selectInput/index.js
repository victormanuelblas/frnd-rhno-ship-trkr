import React from "react";

export default function SelectInput({
  label,
  name,
  register,
  options = [],
  placeholder = "-- Selecciona una opción --",
  required = false,
  errors = {},
}) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "bold",
          }}
        >
          {label}
        </label>
      )}
      <select
        id={name}
        {...register(name, { required })}
        style={{
          width: "100%",
          padding: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <option value="">{placeholder}</option>
        {(options ?? []).map((opt) => (
          <option key={opt.value || opt.id} value={opt.value || opt.id}>
            {opt.label || opt.name}
          </option>
        ))}
      </select>

      {errors[name] && (
        <span style={{ color: "red", fontSize: "0.8rem" }}>
          Este campo es obligatorio
        </span>
      )}
    </div>
  );
}
