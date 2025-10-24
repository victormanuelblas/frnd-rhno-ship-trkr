'use client'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Hook de protección de rutas.
 * @param {boolean} requireAuth - true si la página requiere sesión (default: true)
 * @returns {object} { user, token, checked }
 */
export default function useAuthGuard(requireAuth = true) {
  const router = useRouter()
  const { user, token } = useSelector((state) => state.auth)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // Caso 1: Página privada, pero no hay sesión -> redirige
    if (requireAuth && (!token || !user)) {
      router.replace('/login')
      return
    }

    // Caso 2: Página pública, no requiere sesión -> simplemente marca como verificado
    setChecked(true)
  }, [requireAuth, token, user, router])

  return { user, token, checked }
}
