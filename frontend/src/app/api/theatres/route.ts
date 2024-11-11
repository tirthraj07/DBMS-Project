export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store';

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url);
    const theatre_name = searchParams.get('theatre_name');

    if(theatre_name){
        console.log(theatre_name)
        const searchTheatreNameResponse = await fetch(`${process.env.THEATRE_SERVICE_API}/api/v1/search-theatres/search?theatre_name=${theatre_name}`)
        const searchTheatreName = await searchTheatreNameResponse.json()
        return NextResponse.json({data:searchTheatreName})
    }
    else{
        const searchTheatreNameResponse = await fetch(`${process.env.THEATRE_SERVICE_API}/api/v1/theatres`)
        const searchTheatreName = await searchTheatreNameResponse.json()
        
        return NextResponse.json({data:searchTheatreName})
    }

}