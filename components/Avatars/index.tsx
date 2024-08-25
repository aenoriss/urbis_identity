'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AvatarPage() {
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    setVerificationStatus(searchParams.get('verificationStatus'))
    setMessage(searchParams.get('message'))
  }, [searchParams])

  return (
    <div>
      <h1>Avatar Page</h1>
      {verificationStatus && (
        <p>Verification status: {verificationStatus}</p>
      )}
      {message && (
        <p>Message: {message}</p>
      )}
      {/* Rest of your avatar page content */}
    </div>
  )
}