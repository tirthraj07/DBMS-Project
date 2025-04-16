import { NextRequest, NextResponse } from "next/server";
import { JsonWebToken } from "@/lib/JWT/JWT"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json(
            { valid: false, error: 'Token is required' },
            { status: 400 }
        );
    }

    try {
        const JWT = new JsonWebToken();
        // Verify the token
        const { success, decodedToken } = await JWT.validateToken(token);

        // Token is valid; return the decoded payload
        return NextResponse.json({ valid: success, decodedToken });
    } catch (error) {
        // Token verification failed
        return NextResponse.json(
            { valid: false, error: 'Invalid or expired token' },
            { status: 401 }
        );
    }
}