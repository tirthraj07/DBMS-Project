import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }:{
    params:{
        movie_id:string
    }
}){

    const fetchMovieResponse = await fetch(`${process.env.MOVIE_SERVICE_API}/api/v1/movies/${params.movie_id}`)
    const fetchMovie = await fetchMovieResponse.json()

    let showtimes = []

    const movieShowtimesResponse = await fetch(`${process.env.THEATRE_SERVICE_API}/api/v1/showtimes?movie_id=${params.movie_id}`)
    const movieShowtimes = await movieShowtimesResponse.json();
    

    const payload = {...fetchMovie, showtimes:movieShowtimes.data}

    // fetch showtimes from `${process.env.THEATRE_SERVICE_API}/api/v1/showtimes?movie_id=${params.movie_id}`


    return NextResponse.json(payload,{status:200})
}