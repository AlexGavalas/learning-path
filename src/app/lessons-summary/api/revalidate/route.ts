import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');

    if (secret !== process.env.REVALIDATE_SECRET) {
        return new NextResponse(JSON.stringify({ message: 'Invalid Token' }), {
            status: 401,
            statusText: 'Unauthorized',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const path = request.nextUrl.searchParams.get('path');

    if (path) {
        revalidatePath(path);

        return NextResponse.json({ revalidated: true });
    } else {
        return NextResponse.json({
            revalidated: false,
            message: 'No path provided',
        });
    }
}
