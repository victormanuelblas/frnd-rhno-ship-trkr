"use client";
import { useState } from "react";
import "./style.sass"

export default function AddItemsPopup({ visible, onClose, onAdd }) {
  const [tempItem, setTempItem] = useState({ type: "", qty: "", weight: "" });

  const handleAdd = () => {
    if (!tempItem.type || !tempItem.qty || !tempItem.weight) return;
    onAdd(tempItem); // 👉 enviamos al padre
    setTempItem({ type: "", qty: "", weight: "" });
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h4>Agregar ítem</h4>

        <select
          value={tempItem.type}
          onChange={(e) => setTempItem({ ...tempItem, type: e.target.value })}
        >
          <option value="">-- Tipo --</option>
          <option value="1">Bulto</option>
          <option value="2">Caja</option>
        </select>

        <input
          type="number"
          placeholder="Cantidad"
          value={tempItem.qty}
          onChange={(e) => setTempItem({ ...tempItem, qty: e.target.value })}
        />

        <input
          type="number"
          step="0.1"
          placeholder="Peso"
          value={tempItem.weight}
          onChange={(e) => setTempItem({ ...tempItem, weight: e.target.value })}
        />

        <div className="popup-actions" style={{ marginTop: "1rem" }}>
          <button type="button" onClick={handleAdd}>✅ Agregar</button>
          <button type="button" onClick={onClose}>❌ Cancelar</button>
        </div>
      </div>
    </div>
  );
}
