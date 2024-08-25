// File: app/avatars/page.tsx

'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function AvatarsPage() {
  const searchParams = useSearchParams()
  const authError = searchParams.get('authError')

  useEffect(() => {
    if (authError === 'OAuthCallback') {
      // Handle the error, e.g., show a message to the user
      console.log('Authentication error occurred. Please try again.')
    }
  }, [authError])

  return (
    <div>
      <h1>Choose Your Avatar</h1>
      {authError === 'OAuthCallback' && (
        <p>There was an issue with authentication. Please try again or choose a different method.</p>
      )}
      {/* Rest of your avatar selection UI */}
    </div>
  )
}