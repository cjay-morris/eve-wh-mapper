'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocationContext } from '~/context/LocationProvider';

interface Signature {
    id: string;
    type?: string;
    strength?: string;
}

const parseSignatures = (signatureString: string) => {
    // for each new line in the signature dump, split the string by tabs
    const sigs = [] as Signature[];
    const lines = signatureString.split('\n');
    lines.forEach((line) => {
        const parts = line.split('\t');
        sigs.push({
            id: parts[0] ?? 'Unknown',
            type: parts[3],
        });
    })
    return sigs
}

export default function SignatureInput() {
  const { data: session } = useSession()
  const [sigDump, setSigDump] = useState('')
  const { currentLocation } = useLocationContext()

  const submitSigsToApi = async (sigs: Signature[]) => {
    try {
      const res = await fetch('/api/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sigs, system: currentLocation }),
      });

      const data = await res.json() as { success: boolean };
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  const printSignature = () => {
    try {
      const sigs = parseSignatures(sigDump);
      void submitSigsToApi(sigs);
    } catch (error) {
      console.error(error);
    }
  }

  if (!session) {
    return null
  }

  return (
    <form className="mb-4">
      <textarea
        value={sigDump}
        onChange={(e) => setSigDump(e.target.value)}
        placeholder="Paste your signature dump here"
        className="mr-2 p-2 border w-full bg-amarr-primary text-amarr-secondary p-4 rounded resize-none h-48"
      />
      <button type="button" className="p-2 bg-amarr-secondary text-amarr-primary rounded" onClick={printSignature}>
        Add Signatures
      </button>
    </form>
    );
}
