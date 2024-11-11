"use client"

import { useState, useEffect, Suspense } from "react"

export default function HomePage(){
    const [genres, setGenres] = useState<any[]>([]);

    useEffect(()=>{
        const fetchMovieGenres = async() => {
            const response = await fetch('/api/genres/movies');
            const data = await response.json()
            console.log(data)
            setGenres(data)
        }

        fetchMovieGenres();

    },[])

    async function handleMovieClick(movie_id: number){
        console.log("Movie_id ", movie_id)
        window.location.href=`/movies/${movie_id}`
    }

    return(
        <>
            <div className="container mx-auto px-4 overflow-y-hidden">
            <h1 className="text-4xl font-bold mb-8 mt-3 text-center">Movie Genres</h1>
                {
                    genres && genres.length!=0 &&
                    Object.keys(genres).map((genreName:string) => {
                        return (
                            <div key={genreName}  className="mb-12 overflow-y-hidden">
                                <h2 className="font-bold text-2xl text-center mb-4">{genreName}</h2>
                                <div className="flex flex-row overflow-y-hidden overflow-x-auto">
                                {genres[genreName].map((movie: any) => (
                                <div key={movie.movie_id} id={movie.movie_id} onClick={() => handleMovieClick(movie.movie_id)} className="bg-white shadow-md rounded-lg p-4 flex-shrink-0 basis-80 hover:cursor-pointer">
                                    <div className="flex justify-center overflow-x-auto">
                                        <Suspense fallback={<p>Loading..</p>}>
                                        {movie.images && movie.images.length && movie.images.length!=0 ?
                                            <img src={movie.images[0]} alt={movie.movie_title} className="w-full aspect-square object-cover rounded-md" />
                                            :
                                            <img src={"https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg"} alt={movie.movie_title} className="h-32 w-32 object-cover rounded-md"/>
                                        }
                                        </Suspense>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-center mt-2">{movie.movie_title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">Directed by: {movie.movie_director_name}</p>
                                    <p className="text-sm text-gray-500 mb-2">Rating: {movie.movie_rating}/10</p>
                                    <p className="text-sm text-gray-500 mb-4">Duration: {movie.movie_duration}</p>
                                    
                                </div>
                            ))}
                            </div>

                            </div>
                        )
                    })

                }



            </div>    
        </>
    )

}