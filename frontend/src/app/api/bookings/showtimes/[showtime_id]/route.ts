import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest, {
    params
}: {
    params: {
        showtime_id: string
    }
}) {
    const decodedTokenHeader = request.headers.get('x-decoded-token');
    if (!decodedTokenHeader) {
        return NextResponse.json({ error: "No auth token present" }, { status: 401 });
    }

    let decodedToken;
    try {
        decodedToken = JSON.parse(decodedTokenHeader);
    } catch (error) {
        return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    if (!decodedToken.customer_id) {
        return NextResponse.json({ error: "No customer_id found in token" }, { status: 401 });
    }

    const customer_id = decodedToken.customer_id;
    const showtime_id = params.showtime_id;

    try {
        const requestBody = await request.json();
        const seat_ids = requestBody.seat_ids;  // Assuming seat_ids is a comma-separated string

        if (!seat_ids || seat_ids.length === 0) {
            return NextResponse.json({ error: "Seat IDs are required" }, { status: 400 });
        }

        const response = await fetch(`${process.env.BOOKING_SERVICE_API}/api/v1/bookings/showtimes/${showtime_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customer_id,
                seat_ids
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error || "Failed to book seats" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        console.error("Error in booking request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
