'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { logout } from '@/app/store/authSlice'
import { clearClients } from '@/app/store/clientSlice'
import './style.sass'

export default function HeaderInnova() {
  const [menuOpen, setMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()

  const { user, token } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearClients());
    router.push('/login')
  }

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

      {token && (
        <div className="user-session">
          <span className="user-name">{user?.userName || 'Usuario'}</span>
          <span className="separator">|</span>
          <button className="logout-link" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  )
}
