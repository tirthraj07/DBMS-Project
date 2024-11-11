import { JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";

// Function to fetch screens for a given theatre
async function fetchScreens(theatre_id: string) {
    const url = `${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${theatre_id}/screens`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch screens for theatre ID ${theatre_id}`);
    }
    return response.json();
}

// Function to fetch showtimes for a given screen
async function fetchShowtimes(theatre_id: string, screen_id: string, upcoming: string) {
    const url = `${process.env.THEATRE_SERVICE_API}/api/v1/theatres/${theatre_id}/screens/${screen_id}/showtimes?upcoming=${upcoming}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch showtimes for screen ID ${screen_id}`);
    }
    return response.json();
}

export async function GET(request: NextRequest) {
    const decodedTokenHeader = request.headers.get('x-decoded-token');
    if (!decodedTokenHeader) {
        return NextResponse.json({ error: "No auth token present" }, { status: 401 });
    }

    let decodedToken: JWTPayload;
    try {
        decodedToken = JSON.parse(decodedTokenHeader);
    } catch (error) {
        return NextResponse.json({ error: "Invalid token format" }, { status: 400 });
    }

    if (!decodedToken.theatre_id) {
        return NextResponse.json({ error: "Not a theatre id" }, { status: 401 });
    }

    const theatre_id:any = decodedToken.theatre_id;
    
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get('upcoming') === 'true' ? 'true' : 'false';

    try {
        // 3. Fetch screens for the theatre
        const screens = await fetchScreens(theatre_id);

        // 4. Fetch showtimes for each screen
        const data = await Promise.all(screens.map(async (screen: any) => {
            const showtimes = await fetchShowtimes(theatre_id, screen.screen_id, upcoming);
            return {
                screen_id: screen.screen_id,
                screen_name: screen.screen_name,
                showtimes: showtimes
            };
        }));

        console.log(data)

        // 5. Return the structured response
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
