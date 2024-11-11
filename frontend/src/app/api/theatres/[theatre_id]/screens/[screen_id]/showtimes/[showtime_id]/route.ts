export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store';

import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest, {
    params
}:{
    params:{
        theatre_id:string,
        screen_id:string,
        showtime_id:string
    }
}){
    const { theatre_id, screen_id, showtime_id } = params;

    const response = await fetch(`${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${theatre_id}/screens/${screen_id}/showtimes/${showtime_id}`)

    const data = await response.json();

    return NextResponse.json(data)

}
