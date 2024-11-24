'use client'

import SignatureList from '~/components/SignatureList'
import SignatureInput from '~/components/SignatureInput'
import { useChainContext } from "~/context/ChainContextProvider"

const HomePage = () => {
  const { currentLocation } = useChainContext()

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">EVE Online Signature Tracker</h1>
      You are currently at: {currentLocation}
      <SignatureInput />
      <SignatureList />
    </div>
  );
}

export default HomePage;