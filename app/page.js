"use client";
import Link from 'next/link';
import './style.sass'
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import useAuthGuard from '@/hooks/useAuthGuard';

export default function Home() {
  useAuthGuard(true);

  const dispatch = useDispatch();
  const {user, token} = useSelector((state) => state.auth);

  return (
    <main className="home-container">
      <div className="welcome-box">
        <h1>Bienvenido a Transportes Innova</h1>
        <p>Gestiona y consulta tus servicios de forma rápida y sencilla.</p>
        <Link href="/services" className="btn-primary">
          Ir a Servicios
        </Link>
      </div>
    </main>
  );
}
