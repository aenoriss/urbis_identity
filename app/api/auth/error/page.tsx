'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthError() {
  const router = useRouter()

  useEffect(() => {
    const redirectToAvatars = () => {
      router.replace('/avatars')
      // As a fallback, also use window.location
      window.location.href = '/avatars'
    }

    // Attempt to redirect immediately
    redirectToAvatars()

    // If that doesn't work, try again after a short delay
    const timeoutId = setTimeout(redirectToAvatars, 100)

    return () => clearTimeout(timeoutId)
  }, [router])

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>Redirecting to avatars page...</p>
      <a href="/avatars">Click here if not redirected</a>
    </div>
  )
}