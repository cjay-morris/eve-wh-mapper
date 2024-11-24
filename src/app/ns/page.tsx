'use client'

import SignatureList from '~/components/SignatureList'
import SignatureInput from '~/components/SignatureInput'
import { useChainContext } from "~/context/ChainContextProvider"
import { signOut, signIn, useSession } from 'next-auth/react'

const HomePage = () => {
  const { data: session } = useSession()
  const { currentLocation } = useChainContext()

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">EVE Online Signature Tracker</h1>
      You are currently at: {currentLocation}
      <SignatureInput />
      <SignatureList />
      <button className="p-2 bg-blue-500 text-white rounded" onClick={() => session ? signOut() : signIn()}>
        Sign { session ? 'out' : 'in' }
      </button>
    </div>
  )
}

export default HomePage
