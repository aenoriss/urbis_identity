'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signIn('worldcoin', { redirect: false })
      if (result?.error) {
        console.error('Sign-in failed:', result.error)
        // Proceed to avatars page even if sign-in fails
        router.push('/avatars')
      } else if (result?.ok) {
        router.push('/avatars')
      }
    } catch (error) {
      console.error('Unexpected error during sign-in:', error)
      // Proceed to avatars page if there's an unexpected error
      router.push('/avatars')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={handleSignIn} 
      disabled={isLoading}
      className={`px-4 py-2 rounded ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
    >
      {isLoading ? 'Processing...' : 'Sign in with Worldcoin'}
    </button>
  )
}