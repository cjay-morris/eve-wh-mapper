'use client'

import { signIn, useSession, signOut } from "next-auth/react"
import Image from "next/image"
import { useChainContext } from "~/context/ChainContextProvider"
import Graph from "~/components/Graph"

export default function HomePage() {
  const { data: session } = useSession()
  const { currentLocation } = useChainContext()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {session ? (
          <><div className="flex flex-col items-center">
            {session.user.name}
            <Image src={session.user.image ?? 'test'} alt="You" width={64} height={64} />
            You are in {currentLocation ?? "an unknown location"}
          </div>
          <Graph width={512} height={512} className="border border-black bg-red-600"/>
          <button
            onClick={() => signOut()}
          >
              Sign out
            </button></>
          ) : (
            <button
            onClick={() => signIn('eveonline')}
          >
            Login with EVE SSO
          </button>
          )
        }
      </div>
    </main>
  );
}
