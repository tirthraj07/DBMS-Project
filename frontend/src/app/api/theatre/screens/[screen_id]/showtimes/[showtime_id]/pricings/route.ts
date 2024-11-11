import { JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest, {
    params
}:{
    params:{
        screen_id:string,
        showtime_id:string
    }
}){

    const decodedTokenHeader = request.headers.get('x-decoded-token');
    if (!decodedTokenHeader) {
        return NextResponse.json({ error: "No auth token present" }, { status: 401 });
    }
    let decodedToken: JWTPayload = JSON.parse(decodedTokenHeader);
    if (!decodedToken.theatre_id) {
        return NextResponse.json({ error: "Not a theatre id" }, { status: 401 });
    }

    const theatre_id = decodedToken.theatre_id;
    
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