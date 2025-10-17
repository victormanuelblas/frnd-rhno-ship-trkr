'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BaseEndpoint = process.env.NEXT_PUBLIC_BASE_ENDPOINT; // 👈 definido en tu .env.local

function useFetch(appRoute, requestBody, method = "GET", immediateCall = false, callBack) {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // 🔹 Inicializa la carga
  const init = () => {
    setData(undefined);
    setLoading(true);
    setError("");
  };

  // 🔹 Ejecuta callback cuando termina la carga
  useEffect(() => {
    if (typeof data !== "undefined" && !loading && typeof callBack === "function") {
      callBack(data);
    }
  }, [loading]);

  // 🔹 Llamada inmediata si corresponde
  useEffect(() => {
    if (immediateCall) {
      load();
    }
  }, []);

  // 🔹 Función principal de carga (fetch)
  async function load(options = {}) {
    init();

    try {
      const logn = JSON.parse(localStorage.getItem("logn"));
      const headers = {
        "Content-Type": "application/json",
        //"X-Access-Token": `${logn?.token}`,
      };

      let url = BaseEndpoint;

      if (typeof appRoute === "object") {
        const { path, queryParams } = appRoute;

        // ✅ usa los nuevos queryParams si vienen en options
        const effectiveQueryParams = options.queryParams ?? queryParams;

        const queryString = effectiveQueryParams
          ? "?" + new URLSearchParams(effectiveQueryParams).toString()
          : "";

        url += path + queryString;
      } else {
        // ✅ permite pasar queryParams incluso si appRoute es string
        const queryString = options.queryParams
          ? "?" + new URLSearchParams(options.queryParams).toString()
          : "";

        url += appRoute + queryString;
      }

      const httpMethod = (method || "GET").toString().toUpperCase();
      const fetchOptions = { method: httpMethod, headers };

      if (httpMethod !== "GET") {
        const finalBody = options?.body ?? options?.requestBody ?? requestBody;
        
        if (finalBody) {
          fetchOptions.body = typeof finalBody === "string" ? finalBody : JSON.stringify(finalBody);
        }
      }

      const rspn = await fetch(url, fetchOptions);

      // 🔒 (opcional) redirección si no hay sesión
      /*
      if (rspn.status === 401) {
        router.push("/login");
        return;
      }
      */

      const json = await rspn.json();
      setData(json);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message);

      /*
      if (err.message.includes("Failed to fetch")) {
        router.push("/login");
      }
      */
    } finally {
      setLoading(false);
    }
  }

  return [{ data, loading, error }, load];
}

export default useFetch;
