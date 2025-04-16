import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const userToken = request.cookies.get("userToken")?.value;
    console.log(userToken);
    if (!userToken || userToken == null) {
        return NextResponse.json({ "error": "Could not get cookie header from request" });
    }

    const response = await fetch(`${process.env.CUSTOMER_SERVICE_API}/api/v1/customer/bookings`, {
        method: 'GET',
        headers: {
            "Cookie": `userToken=${userToken}`,
        },
        credentials: "include"
    })

    const responseData = await response.json();
    console.log(responseData);
    return NextResponse.json(responseData);
}