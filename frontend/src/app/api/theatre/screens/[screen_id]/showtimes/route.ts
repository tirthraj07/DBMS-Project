import { JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { screen_id: string } }){
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

    const requestedData = await request.json()

    const { movie_id, showtime_start_time } = requestedData;

    if(!movie_id || !showtime_start_time){
        return NextResponse.json({error:"Insufficient Payload"});
    }

    const response = await fetch(`${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${theatre_id}/screens/${screen_id}/showtimes`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            movie_id, showtime_start_time
        })
    })

    const data = await response.json();
    // console.log(data);
    if(response.ok){
        return NextResponse.json({success: "Added New Show time", data:data.showtime}, {status:201});
    }
    else{
        return NextResponse.json({error:"Couldn't add new Show time"}, {status: 500})
    }
}