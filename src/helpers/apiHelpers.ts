import { type Session } from 'next-auth'

interface LocationAPIRes {
    solar_system_id: number,
    station_id?: number
}

interface SystemAPIRes {
    name: string,
}

const url = 'https://esi.evetech.net/latest'

export const getLocation = async (session: Session | null) => {
    if (!session?.user.id || !session?.accessToken) {
        return "OOPS"
    }
    const res = await fetch((`${url}/characters/${session?.user.id}/location`), {
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`
        }
    })

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: LocationAPIRes = await res.json()
    const systemName = await getSystemName(data.solar_system_id)

    return systemName
}

const getSystemName = async (system_id: number) => {
    const res = await fetch(`${url}/universe/systems/${system_id}`)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: SystemAPIRes = await res.json()

    return data.name
}