'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { type Signature } from '~/types/Signature'
import { useChainContext } from '~/context/ChainContextProvider'

const fetchSignatures = async (system: string) => {
  const res = await fetch('/api/system?system=' + system)
  return res.json()
}

export default function SignatureList() {
  const { data: session } = useSession()
  const { currentLocation } = useChainContext()
  const [signatures, setSignatures] = useState<Signature[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (currentLocation) {
        const data = await fetchSignatures(currentLocation) as { sigs?: Signature[] }
        if (data?.sigs) {
          setSignatures(data.sigs)
        }
      }
    }
    
    void fetchData()
  }, [currentLocation])

  if (!session) {
    return <p>Please sign in to view signatures.</p>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Signatures for {currentLocation}</h2>
      <ul>
        {signatures?.map((sig) => (
          <li key={sig.id} className="mb-2">
            Id: {sig.id}, Type: {sig.type}
          </li>
        ))}
      </ul>
    </div>
  )
}

