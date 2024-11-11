import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { JsonWebToken } from "./lib/JWT/JWT";

const jsonwebtoken = new JsonWebToken();

export async function middleware(request: NextRequest){
    const unprotected_routes = ['/user/login','/theatre/login']
    const unprotected_api_routes = ['/api/user/login','/api/user/signup','/api/theatre/login','/api/theatre/signup']

    if(!unprotected_api_routes.includes(request.nextUrl.pathname)&&request.nextUrl.pathname.startsWith('/api')){
        const token = request.cookies.get('webToken')?.value;
        if(!token){
            const response = NextResponse.json({error: "Unauthorized Access"},{status:401});
            return response;
        }
        const verifiedToken = await jsonwebtoken.validateToken(token);
        if(!verifiedToken.success || !verifiedToken.decodedToken){
            console.error(verifiedToken.error);
            console.error(verifiedToken.reason);
            const response = NextResponse.json({error: "Unauthorized Access"},{status:401});
            return response;
        }
        const decodedToken = verifiedToken.decodedToken;
        request.headers.set('x-decoded-token', JSON.stringify(decodedToken))
        const requestHeaders = new Headers(request.headers)
        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
            });
        return response;
    }

    if(!unprotected_routes.includes(request.nextUrl.pathname)&&!request.nextUrl.pathname.startsWith('/api')){
        const token = request.cookies.get('webToken')?.value;
        if(!token){
            const redirect_url = new URL('/user/login', request.nextUrl);
            const response = NextResponse.redirect(redirect_url);
            return response;
        }
        const verifiedToken = await jsonwebtoken.validateToken(token);
        if(!verifiedToken.success || !verifiedToken.decodedToken){
            console.error(verifiedToken.error);
            console.error(verifiedToken.reason);
            const redirect_url = new URL('/user/login', request.nextUrl);
            const response = NextResponse.redirect(redirect_url);
            return response;
        }
        return NextResponse.next();  
    }

    return NextResponse.next();  

}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',    // Regular expression to match all routes except specific static resources
    ],
};