export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store';

import { NextRequest, NextResponse } from "next/server";

const seatTypeMap = {
    1: "Standard",
    2: "Recliner",
    3: "Premium",
    4: "VIP"
};

export async function POST(request: NextRequest, {
    params
}:{
    params:{
        theatre_id:string,
        screen_id:string,
        showtime_id:string
    }
}){
    const theatre_id = params.theatre_id;
    const showtime_id = params.showtime_id;
    const screen_id = params.screen_id;

    try {
        // Get the body from the request
        const body = await request.json();
        const { price, seat_type_id } = body;

        if (!price || !seat_type_id) {
            return NextResponse.json({ error: "Price and seat_type_id are required" }, { status: 400 });
        }

        const response = await fetch(`${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${theatre_id}/screens/${screen_id}/showtimes/${showtime_id}/pricings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                price,
                seat_type_id
            })
        });

        // Handle the response from the Express API
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error }, { status: response.status });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}

export async function GET(request: NextRequest, {
    params
}:{
    params:{
        theatre_id:string,
        screen_id:string,
        showtime_id:string
    }
}){
    const theatre_id = params.theatre_id;
    const showtime_id = params.showtime_id;
    const screen_id = params.screen_id;

    try {
        const response = await fetch(`${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${theatre_id}/screens/${screen_id}/showtimes/${showtime_id}/pricings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error }, { status: response.status });
        }

        const pricingWithSeatTypes = data.pricing.map((pricing: { seat_type_id: number, price: number }) => ({
            ...pricing,
            seat_type_name: seatTypeMap[pricing.seat_type_id] || "Unknown"
        }));

        return NextResponse.json(
            pricingWithSeatTypes
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}