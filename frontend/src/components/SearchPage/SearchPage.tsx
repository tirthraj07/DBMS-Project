"use client"

import { useState, useEffect, Suspense } from "react"

export default function SearchPage({
    searchQuery,
    filter
}:{
    searchQuery:string,
    filter:string
}){
    const [searches, setSearches] = useState<any[]>([]);

    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300); 

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        const searchMovies = async () => {
            console.log(`${debouncedQuery} in Movies`);
            const response = await fetch(`/api/movies?movie_title=${debouncedQuery}`);
            const data = await response.json();
            setSearches(data.data);
        };

        const searchTheatres = async () => {
            console.log(`${debouncedQuery} in Theatre`);
            const response = await fetch(`/api/theatres?theatre_name=${debouncedQuery}`);
            const data = await response.json();
            setSearches(data.data);
        };

        if (debouncedQuery) {
            if (filter === "movies") {
                searchMovies();
            } else {
                searchTheatres();
            }
        }
    }, [debouncedQuery, filter]);

    async function handleMovieClick(movie_id: number){
        console.log("Movie_id ", movie_id)
        window.location.href=`/movies/${movie_id}`
    }

    async function handleTheatreClick(theatre_id: number){
        console.log("Theatre_id ", theatre_id)
        window.location.href=`/theatres/${theatre_id}/showtimes`
    }

    return (
        <>
            {filter=="movies" &&
                <div>
                    <div className="container mx-auto px-4 overflow-y-hidden">
                    <h1 className="text-4xl font-bold mb-8 mt-3 text-center">Search Movies</h1>
                    <div className="flex flex-row overflow-x-hidden flex-wrap justify-center">
                    {
                        searches && searches.length > 0 &&
                        searches.map((movie: any) => (
                            <div key={movie.movie_id} id={movie.movie_id} onClick={() => handleMovieClick(movie.movie_id)} className="bg-white mt-2 shadow-md rounded-lg p-4 flex-shrink-0 basis-80 hover:cursor-pointer">
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
                        ))
                    }
                    </div>  
                    </div>
                </div>
            }
            
            {filter=="theatres" && 
            <div>
                <div className="container mx-auto px-4 overflow-y-hidden">
                <h1 className="text-4xl font-bold mb-8 mt-3 text-center">Search Theatre</h1>
                <div className="p-5 flex flex-row overflow-x-hidden gap-5 flex-wrap justify-center">
                {
                    searches && searches.length > 0 &&
                    searches.map((theatre: any) => (
                        <div key={theatre.theatre_id} onClick={() => handleTheatreClick(theatre.theatre_id)} className="bg-white shadow-md rounded-lg p-4 flex-shrink-0 basis-80 hover:cursor-pointer">
                            <h3 className="text-xl font-bold mb-2 text-center mt-2">{theatre.theatre_name}</h3>
                            <p className="text-sm text-gray-600 mb-2">Location : {theatre.theatre_location}</p>                            
                        </div>
                    ))
                }
                </div>  
                </div>
            </div>

            }



        
        </>

    )

}