'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BaseEndpoint = process.env.NEXT_PUBLIC_BASE_ENDPOINT; // 👈 define esto en tu .env.local

function useFetch(appRoute, requestBody, method = "GET", immediateCall = false, callBack) {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const init = () => {
    setData(undefined);
    setLoading(true);
    setError("");
  };  
  
  // callback cuando termina la carga
  useEffect(() => {
    if (typeof data !== "undefined" && !loading && typeof callBack === "function") {
      callBack(data);
    }
  }, [loading]);

  // llamada inmediata si corresponde
  useEffect(() => {
    if (immediateCall) {
      load();
    }
  }, []);

async function load(options = {}) {
  init();
  try {
    let logn = JSON.parse(localStorage.getItem("logn"));
    let headers = {
      "Content-Type": "application/json",
      //"X-Access-Token": `${logn?.token}`,
    };

    let url = BaseEndpoint;
      if (typeof appRoute === "object") {
        const { path, queryParams } = appRoute;
        const queryString = queryParams
          ? "?" + new URLSearchParams(queryParams).toString()
          : "";
        url += path + queryString;
      } else {
        url += appRoute;
      }

    const httpMethod = (method || "GET").toString().toUpperCase();

    let fetchOptions = { method: httpMethod, headers };
    if (httpMethod !== "GET") {
      const finalBody = options?.body ?? options?.requestBody ?? requestBody;

      if (finalBody) {
        fetchOptions.body = typeof finalBody === "string" ? finalBody : JSON.stringify(finalBody);
      }
    }
    const rspn = await fetch(url, fetchOptions);
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
  }
  setLoading(false);
}

  return [{ data, loading, error }, load];
}

export default useFetch;