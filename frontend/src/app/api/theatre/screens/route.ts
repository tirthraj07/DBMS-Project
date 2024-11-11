import { JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const decodedTokenHeader = request.headers.get('x-decoded-token');
    if(!decodedTokenHeader){
        return NextResponse.json({error:"No auth token present"}, {status:401})
    }
    let decodedToken : JWTPayload = JSON.parse(decodedTokenHeader);
    if(!decodedToken.theatre_id){
        return NextResponse.json({error:"Not a theatre id"}, {status:401})
    }

    const theatre_id = decodedToken.theatre_id;
    const { screen_name, seats, no_of_rows, max_row_seats } = await request.json();
    if(!screen_name || !seats || !no_of_rows || !max_row_seats){
        return NextResponse.json({error:"Insufficient Payload"}, {status: 400})
    }

    console.log(seats)

    // filter only the seats which are of status "active"
    // count the total no. of active seats and store it in screen_total_seats
    const activeSeats = seats.flat().filter((seat:any) => seat.state === 'active');
    const screen_total_seats = activeSeats.length;

    // first create a new screen using post request on route 
    // ${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${theatre_id}/screens
    // it expects the following payload: screen_name, screen_total_seats, theatre_id,no_of_rows,max_row_seats
    const screenResponse = await fetch(`${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${theatre_id}/screens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            screen_name,
            screen_total_seats,
            theatre_id,
            no_of_rows,
            max_row_seats
        })
    });

    if (!screenResponse.ok) {
        return NextResponse.json({error: "Failed to create screen"}, {status: 500});
    }



    // You will get back screen_id from screen.screen_id
    const screenData = await screenResponse.json();
    console.log(screenData)
    const screen_id = screenData.screen.screen_id;
    console.log(screen_id)

    // Then using the seats array which is 2D, pass each 1D array to the api ${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${theatre_id}/screens/${screen_id}/seats (POST)
    // The api expects the following payload
    // const seats = req.body.seats; // Array of { row_num, seat_number, seat_type_id }
    

    const rowSeats = activeSeats.map((seat:any) => ({
        row_num: seat.row,
        seat_number: seat.seat,
        seat_type_id: seat.type === 'Standard' ? 1 
                        : seat.type === 'Recliner' ? 2
                        : seat.type === 'Premium' ? 3
                        : seat.type === 'VIP' ? 4
                        : null  // Handle unknown types if necessary
    }));

    const seatResponse = await fetch(`${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${theatre_id}/screens/${screen_id}/seats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seats: rowSeats })
    });

    if (!seatResponse.ok) {
        return NextResponse.json({error: "Failed to add seats"}, {status: 500});
    }


    return NextResponse.json({success: "Screen and seats created successfully"});
}

export async function GET(request: NextRequest){
    const decodedTokenHeader = request.headers.get('x-decoded-token');
    if(!decodedTokenHeader){
        return NextResponse.json({error:"No auth token present"}, {status:401})
    }
    let decodedToken : JWTPayload = JSON.parse(decodedTokenHeader);
    if(!decodedToken.theatre_id){
        return NextResponse.json({error:"Not a theatre id"}, {status:401})
    }

    const response = await fetch(`${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${decodedToken.theatre_id}/screens`)
    const data = await response.json();


    return NextResponse.json({data: data})

}