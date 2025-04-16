export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store';

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const movieGenresResponse = await fetch(`${process.env.MOVIE_SERVICE_API}/api/v1/genres`)
    const movieGenres = await movieGenresResponse.json()

    let payload = {}

    for (let genre of movieGenres.genres) {
        const movieIdsResponse = await fetch(`${process.env.MOVIE_SERVICE_API}/api/v1/genres/${genre.id}`);
        const movieIds = await movieIdsResponse.json();
        const movies = []

        for (let movie_id of movieIds.movie_ids) {
            const movieDetailResponse = await fetch(`${process.env.MOVIE_SERVICE_API}/api/v1/movies/${movie_id}`);
            const movieDetail = await movieDetailResponse.json();
            movies.push(movieDetail);
        }
        if (movies.length != 0) {
            payload = { ...payload, [genre.genre]: movies }
        }
    }

    return NextResponse.json(payload)
}