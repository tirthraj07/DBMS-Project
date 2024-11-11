import { JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { screen_id: string } }) {
    const decodedTokenHeader = request.headers.get('x-decoded-token');
    if (!decodedTokenHeader) {
        return NextResponse.json({ error: "No auth token present" }, { status: 401 });
    }
    let decodedToken: JWTPayload = JSON.parse(decodedTokenHeader);
    if (!decodedToken.theatre_id) {
        return NextResponse.json({ error: "Not a theatre id" }, { status: 401 });
    }

    const theatre_id = decodedToken.theatre_id;
    const screen_id = params.screen_id;

    const theatreResponse = await fetch(`${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${theatre_id}`);
    if (!theatreResponse.ok) {
        return NextResponse.json({ error: "Error fetching theatre data" }, { status: theatreResponse.status });
    }
    const theatreDetails = await theatreResponse.json();
    

    // Fetch screen data
    const screenResponse = await fetch(`${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${theatre_id}/screens/${screen_id}`);
    if (!screenResponse.ok) {
        return NextResponse.json({ error: "Failed to fetch screen data" }, { status: 500 });
    }
    const screen_data = await screenResponse.json();

    // Fetch seat data
    const seatResponse = await fetch(`${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${theatre_id}/screens/${screen_id}/seats`);
    if (!seatResponse.ok) {
        return NextResponse.json({ error: "Failed to fetch seat data" }, { status: 500 });
    }
    const seatDataArray = await seatResponse.json();

    // Convert seatDataArray (1D) into 2D array by row_num
    const seatData2D: any[] = [];
    seatDataArray.forEach((seat:any) => {
        const rowIndex = seat.row_num - 1; // Subtract 1 to convert row_num to a zero-based index
        if (!seatData2D[rowIndex]) {
            seatData2D[rowIndex] = []; // Initialize row if it doesn't exist
        }
        seatData2D[rowIndex].push(seat); // Push seat into the respective row
    });
    
    // Filter out empty rows (only keep rows that have at least one seat)
    const filteredSeatData2D = seatData2D.filter(row => row.length > 0);
    
    

    // Final payload
    const finalPayload = {
        screen_data: {
            screen_id: screen_data.screen_id,
            screen_name: screen_data.screen_name,
            screen_total_seats: screen_data.screen_total_seats,
            no_of_rows: screen_data.no_of_rows,
            max_row_seats: screen_data.max_row_seats,
            theatre_id: theatreDetails.theatre_id,
            theatre_name: theatreDetails.theatre_name,
            theatre_location: theatreDetails.theatre_location
        },
        seat_data: filteredSeatData2D // Use the filtered seat data
    };
    

    return NextResponse.json(finalPayload);
}
