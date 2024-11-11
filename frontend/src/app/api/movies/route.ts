import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url);
    const movie_title = searchParams.get('movie_title');

    if(movie_title){
        const searchMovieTitleResponse = await fetch(`${process.env.MOVIE_SERVICE_API}/api/v1/search-movies/search?movie_name=${movie_title}`)
        const searchMovieTitle = await searchMovieTitleResponse.json()
        return NextResponse.json({data:searchMovieTitle.data})
    }
    else{
        const searchMovieTitleResponse = await fetch(`${process.env.MOVIE_SERVICE_API}/api/v1/movies`)
        const searchMovieTitle = await searchMovieTitleResponse.json()
        return NextResponse.json({data:searchMovieTitle.data})
    }

}