'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Home() {
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
    <div className="bg-pink-500 p-6 rounded-xl max-w-sm mx-auto">
      <div className="flex flex-col items-center">
        <Image
          src="/logIn_hero.png"
          alt="Virtual identity avatar"
          width={200}
          height={200}
          className="rounded-full mb-4"
        />
        <h2 className="text-white text-xl font-bold mb-2">Own your virtual identity</h2>
        <p className="text-white text-center mb-4">Validate your personhood and unlock new opportunities</p>
        <button 
          onClick={handleSignIn} 
          disabled={isLoading}
          className={`bg-white text-pink-500 font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        >
          {isLoading ? 'Processing...' : 'Sign in with Worldcoin ID'}
        </button>
      </div>
    </div>
  )
}