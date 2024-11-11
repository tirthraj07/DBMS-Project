import { JsonWebToken } from "@/lib/JWT/JWT";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    
    const requestBody = await request.json()

    const response = await fetch(`${process.env.CUSTOMER_SERVICE_API}/auth/signup`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(requestBody)
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

        const customerDataRequest = await fetch(`${process.env.CUSTOMER_SERVICE_API}/api/v1/customer`,{
            method:'GET',
            headers:{
                'cookie': setCookieHeader
            }
        })
            
        const customerData = await customerDataRequest.json()
        console.log(customerData)
        const webToken = await jwt.createToken(customerData.user);
        
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