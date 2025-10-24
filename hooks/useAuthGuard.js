"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useAuthGuard(requireAuth = true) {
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (requireAuth && !token) {
      router.push("/login");
    }

    if (!requireAuth && token) {
      router.push("/");
    }
  }, [token, requireAuth, router]);
}
