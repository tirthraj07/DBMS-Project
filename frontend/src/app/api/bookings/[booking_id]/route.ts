import { JsonWebToken } from "@/lib/JWT/JWT";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {
    params
}: {
    params: {
        booking_id: string;
    }
}) {
    const JWT = new JsonWebToken();
    const response = await fetch(`${process.env.BOOKING_SERVICE_API}/api/v1/bookings/${params.booking_id}`);
    const responseData = await response.json();
    console.log(responseData);
    const ticketToken = await JWT.createTicketToken(responseData);
    console.log(ticketToken);
    responseData.ticketToken = ticketToken;
    // Now i want to create a token so that i can verify the ticket in future
    // Create a function in the JWT utility class that allows us to pass the ticket and sign it 
    // then add the token in the responseData

    return NextResponse.json(responseData);
}