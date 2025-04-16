import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {
        const response = NextResponse.json({ success: "Logged out successfully" })

        response.cookies.set('webToken', '', { maxAge: 0, path: '/' });
        response.cookies.set('userToken', '', { maxAge: 0, path: '/' });
        response.cookies.set('role', '', { maxAge: 0, path: '/' });
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: "Unable to clear tokens" })
    }

}