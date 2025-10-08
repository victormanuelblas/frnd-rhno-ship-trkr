"use client";
import Link from 'next/link';
import './style.sass'

export default function Home() {
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
