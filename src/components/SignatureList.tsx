import { type Signature } from '~/types/Signature'
import { useLocationContext } from '~/context/LocationProvider'

export default function SignatureList() {
  const { currentLocation, locationData } = useLocationContext()

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Signatures for {currentLocation}</h2>
      <ul>
        {locationData?.sigs?.map((sig: Signature) => (
          <li key={sig.id} className="mb-2">
            Id: {sig.id}, Type: {sig.type}
          </li>
        ))}
      </ul>
    </div>
  )
}

