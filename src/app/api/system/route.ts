import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import { type Signature, type SignaturePushRequest } from '~/types/Signature';

const redis = Redis.fromEnv();

export const GET = async (req: Request):
Promise<NextResponse<
    { error?: string,
      sigs?: Signature[],
    }
>> => {
    // get the system name from the query params
    try {
        const { searchParams } = new URL(req.url);
        const system = searchParams.get('system');
        if (!system || system === 'Unknown') {
            return NextResponse.json({ error: 'No system provided' }, { status: 400 });
        }

        const sigs = await redis.get(system);
        if (!sigs) {
            return NextResponse.json({ error: 'No signatures found for system' }, { status: 404 });
        }
        const parsedSigs = JSON.parse(JSON.stringify(sigs)) as Signature[];
        return NextResponse.json({ sigs: parsedSigs });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
    }
};

export const POST = async (req: Request) => {
    try {
        const body = await req.json() as SignaturePushRequest;
        const { system, sigs } = body
        if (!system || !sigs) {
            return NextResponse.json({ error: 'Missing system or sigs on body' }, { status: 400 });
        }

        await redis.set(system, JSON.stringify(body.sigs));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
    }
};
