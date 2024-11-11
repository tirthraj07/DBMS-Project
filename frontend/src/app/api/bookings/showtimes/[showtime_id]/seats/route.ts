export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store';

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {
    params
}: {
    params: {
        showtime_id: string;
    }
}) {
    const { showtime_id } = params;

    try {
        // Call the Express API to fetch bookings for the specified showtime_id
        const response = await fetch(`${process.env.BOOKING_SERVICE_API}/api/v1/bookings/showtimes/${showtime_id}/seats`,{
            headers: { 'Cache-Control': 'no-cache' }
        });

        const bookings = await response.json();

        return NextResponse.json(bookings, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
