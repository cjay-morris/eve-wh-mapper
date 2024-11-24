'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface Signature {
    id: string;
    type: string;
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
            type: parts[3] ?? 'Unknown',
        });
    })
    return sigs
}

export default function SignatureInput() {
  const { data: session } = useSession()
  const [sigDump, setSigDump] = useState('')

  const submitSigsToApi = async (sigs: Signature[]) => {
    try {
      const res = await fetch('/api/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sigs, system: 'Sooma' }),
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
        placeholder="Signature dump here"
        className="mr-2 p-2 border rounded w-full"
      />
      <button type="button" className="p-2 bg-blue-500 text-white rounded" onClick={printSignature}>
        Add Signatures
      </button>
    </form>
    );
}
