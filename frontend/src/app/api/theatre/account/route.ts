import { JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const decodedTokenHeader = request.headers.get('x-decoded-token');
    if(!decodedTokenHeader){
        return NextResponse.json({error:"No auth token present"}, {status:401})
    }
    let decodedToken : JWTPayload = JSON.parse(decodedTokenHeader);
    if(!decodedToken.theatre_user_id){
        return NextResponse.json({error:"Not a theatre user"}, {status:401})
    }


    const fetchTheatreDetails = await fetch(`${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${decodedToken.theatre_id}`)
    const theatreDetails = await fetchTheatreDetails.json()


    const fetchAccountDetails = await fetch(`${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${decodedToken.theatre_id}/users/${decodedToken.theatre_user_id}`)
    const accountDetails = await fetchAccountDetails.json();
    
    const payload = {
        theatre_id: theatreDetails.theatre_id,
        theatre_name:theatreDetails.theatre_name,
        theatre_location:theatreDetails.theatre_location,
        theatre_user_id:accountDetails.theatre_user_id,
        theatre_user_full_name:accountDetails.theatre_user_full_name,
        theatre_user_email:accountDetails.theatre_user_email
    }
    console.log(payload)

    return NextResponse.json(payload);
}   