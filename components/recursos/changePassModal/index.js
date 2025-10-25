"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useFetchData } from "@/hooks/useFetchData";
import "./style.sass";

export default function ChangePassModal({ isOpen, onClose }) {
  const token = useSelector((state) => state.auth.token);

  const [form, setForm] = useState({
    oldUserPass: "",
    userPass: "",
    confirmPass: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.userPass !== form.confirmPass) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const result = await useFetchData({
        path: "auth/pass",
        method: "PUT",
        body: {
          oldUserPass: form.oldUserPass,
          userPass: form.userPass,
        },
        token,
      });

      if (result.error) {
        setMessage(result.data?.message || "Error al actualizar contraseña");
      } else {
        setMessage("Contraseña actualizada correctamente ✅");
        setForm({ oldUserPass: "", userPass: "", confirmPass: "" });
        setTimeout(() => onClose(), 1200);
      }
    } catch (err) {
      setMessage("Error interno del servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Cambiar contraseña</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="oldUserPass"
            placeholder="Contraseña actual"
            value={form.oldUserPass}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="userPass"
            placeholder="Nueva contraseña"
            value={form.userPass}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPass"
            placeholder="Confirmar nueva contraseña"
            value={form.confirmPass}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Actualizando..." : "Guardar cambios"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
