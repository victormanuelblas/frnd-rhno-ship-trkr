"use client";
import React, { useEffect, useState } from "react";

export default function DateInput({
  label,
  name,
  register,
  required = false,
  errors = {},
  min,
  max,
}) {
  const [defaultDate, setDefaultDate] = useState("");

  // 📌 aseguramos que el valor por defecto solo se calcule en el cliente
  useEffect(() => {
    setDefaultDate(new Date().toISOString().split("T")[0]);
  }, []);

  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && (
        <label
          htmlFor={name}
          style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}
        >
          {label}
        </label>
      )}
      <input
        type="date"
        id={name}
        defaultValue={defaultDate} // 👈 ahora no rompe SSR
        {...(register ? register(name, { required }) : {})}
        min={min}
        max={max}
        style={{
          width: "100%",
          padding: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      {errors[name] && (
        <p style={{ color: "red", fontSize: "0.8rem" }}>
          {label || name} es requerido
        </p>
      )}
    </div>
  );
}
