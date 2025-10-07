'use client'

import { useState } from 'react'
import './style.sass'

export default function HeaderInnova() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="client-header">
      <div className="header-left">
        <a href="https://transportesinnova.com/">
          <img src="/assets/home/innova-logo.png" alt="Logo Innova" />
        </a>
      </div>

      <div className="header-center">
        <nav className={menuOpen ? 'open' : ''}>
          <ul>
            <li><a href="https://transportesinnova.com/">Inicio</a></li>
            <li><a href="https://transportesinnova.com/servicios/">Servicios</a></li>
            <li><a href="https://transportesinnova.com/noticias/">Noticias</a></li>
            <li><a href="https://transportesinnova.com/contacto/">Contacto</a></li>
          </ul>
        </nav>

        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className="header-right">
        <img src="/assets/home/innova-phone.png" alt="Teléfono Innova" />
      </div>
    </header>
  )
}
