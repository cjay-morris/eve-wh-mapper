'use client';

import SignatureList from '~/components/SignatureList'
import SignatureInput from '~/components/SignatureInput'
import { useLocationContext } from "~/context/LocationProvider"
import Header from '~/components/Header'
import { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'

const HomePage = () => {
  const { currentLocation } = useLocationContext()
  const session = useSession()

  useEffect(() => {
    if (session?.data?.error === 'RefreshAccessTokenError') {
      console.error('Failed to refresh token')
      void signIn()
    }
  }, [session])

  return (
    <div className="w-full min-h-screen bg-amarr-primary text-amarr-secondary">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <p className="text-l font-bold mb-4">
          You are currently at: {currentLocation}
        </p>
        <SignatureInput />
        <SignatureList />
      </div>
    </div>
  )
}

export default HomePage
