'use client'

import { useState } from 'react'
import Link from 'next/link';
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
            <li><Link href="https://transportesinnova.com">Inicio</Link></li>
            <li><Link href="https://transportesinnova.com/servicios">Servicios</Link></li>
            <li><Link href="https://transportesinnova.com/noticias">Noticias</Link></li>
            <li><Link href="https://transportesinnova.com/contacto">Contacto</Link></li>
            <li><Link href="/">Intranet</Link></li>
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
