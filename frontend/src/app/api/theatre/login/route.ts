import { JsonWebToken } from "@/lib/JWT/JWT";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    const requestBody = await request.json()
    const { theatre_user_email, theatre_user_password } = requestBody;
    if(!theatre_user_email || !theatre_user_password){
        return NextResponse.json({error:"Insufficient Payload"});
    }

    const response = await fetch(`${process.env.THEATRE_SERVICE_API}/auth/login`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(requestBody)
    })

    const setCookieHeader = response.headers.get('set-cookie');

    const responseData = await response.json();


    if(responseData.error){
        console.log(responseData.error)
        return NextResponse.json({error:responseData.error});
    }

    const nextResponse = NextResponse.json(responseData, { status: response.status });

    if (setCookieHeader) {
 
        const jwt = new JsonWebToken();


        const webToken = await jwt.createToken(responseData.theatre_user);
        
        nextResponse.cookies.set('webToken', webToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        nextResponse.headers.append('Set-Cookie', setCookieHeader);
    
        return nextResponse;
    }


    return NextResponse.json({"error":"External server did not return a token"})

}