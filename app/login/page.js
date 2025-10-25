"use client";

import "./style.sass";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { useFetchData } from "@/hooks/useFetchData";
import useAuthGuard from "@/hooks/useAuthGuard";

export default function LoginPage() {
  const { user, checked } = useAuthGuard(false); // PÁGINA PÚBLICA
  const router = useRouter();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ userEmail: "", userPass: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.clientId) router.push("/");
  }, [user]);
  
  if (!checked) return null;
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loginResult = await useFetchData({
        path: "auth/login",
        method: "POST",
        body: form,
      });

      if (loginResult.error || !loginResult.data?.token) {
        setError(loginResult.data?.message || "Credenciales inválidas");
        setLoading(false);
        return;
      }

      const token = loginResult.data.token;

      const profileResult = await useFetchData({
        path: "auth/profile",
        method: "GET",
        token,
      });

      if (profileResult.error || !profileResult.data) {
        setError("Error al cargar perfil");
        setLoading(false);
        return;
      }

      dispatch(
        setCredentials({
          token,
          user: {
            userId: profileResult.data.userId,
            userLevel: profileResult.data.userLevel,
            clientId: profileResult.data.clientId,
            bussinesId: profileResult.data.bussinesId,
            userName: profileResult.data.userName,
            userMail: profileResult.data.userEmail,
          },
        })
      );

      router.push("/");
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error interno del servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Iniciar Sesión</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="userEmail"
            placeholder="Correo electrónico"
            value={form.userEmail}
            onChange={handleChange}
            className="input"
          />
          <input
            type="password"
            name="userPass"
            placeholder="Contraseña"
            value={form.userPass}
            onChange={handleChange}
            className="input"
          />
          <button type="submit" disabled={loading} className="button">
            {loading ? "Ingresando..." : "Entrar"}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}
