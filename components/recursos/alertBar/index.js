"use client";
import { useEffect, useState } from "react";

export default function AlertBar({ message, type = "success", onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false); // iniciar salida
        setTimeout(() => onClose(), 300); // remover después de la animación
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        padding: "1rem 2rem",
        borderRadius: "6px",
        color: "white",
        fontWeight: "bold",
        backgroundColor: type === "success" ? "green" : "red",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
        zIndex: 1000,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-20px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {message}
    </div>
  );
}
