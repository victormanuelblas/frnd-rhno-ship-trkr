"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import ChangePassModal from "../recursos/changePassModal";
import "./style.sass";

export default function FooterInnova() {
  const user = useSelector((state) => state.auth.user);
  const [showModal, setShowModal] = useState(false);

  return (
    <footer className="footer-innova">
      <div className="footer-left">
        <p>© 2025 Transportes Innova</p>
      </div>

      <div className="footer-right">
        {user ? (
          <>
            <a onClick={() => setShowModal(true)} className="link">
              Cambiar contraseña
            </a>
            <ChangePassModal isOpen={showModal} onClose={() => setShowModal(false)} />
          </>
        ) : (
          <p>Inicia sesión para acceder a más funciones</p>
        )}
      </div>
    </footer>
  );
}
