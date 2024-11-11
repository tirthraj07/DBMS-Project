"use client"

import { useState, useEffect } from "react";

import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"
  
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

export default function MoviePage({params}:{params:{movie_id:string}}){
    const [error, setError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [data, setData] = useState<any>();

    useEffect(()=>{
        
        const fetchMovies = async() => {    
            try{
                const response = await fetch(`/api/movies/${params.movie_id}`)
                if(!response.ok){
                    throw new Error("Server response not okay")
                }
                const data = await response.json();
                console.log(data)
                setData(data)
                setError(false)
            }
            catch(error){
                console.log(error)
                setErrorMessage("Error while fetching the movie")
                setError(true)
            }
        }

        fetchMovies()

    },[])

    return(
        <>
            <div className="border border-black relative w-full min-h-full flex flex-col pt-5 items-center gap-5" style={{minHeight:"calc(100vh - 5rem)"}}>
            {
                error 
                && 
                <Alert variant="destructive" className={`absolute top-0 left-0 z-0`}>
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {errorMessage}
                    </AlertDescription>
                </Alert>
            
            }
            {
                !error
                &&
                data
                &&
                <>
                    <div className="flex flex-col items-center gap-5 w-full">
                        {/* Display Images */}
                        <div className="flex justify-center gap-2 overflow-x-hidden">
                            {data.images?.map((image: string, index: number) => (
                                <img key={index} src={image} alt={`Image ${index + 1}`} className="h-80 object-cover rounded-md shadow-md" />
                            ))}
                            {
                                data.images.length==0&&
                                <img src={"https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg"} alt={data.movie_title} className="h-72 w-fit object-cover rounded-md"/>
                            }
                        </div>

                        {/* Movie Title */}
                        <h1 className="text-4xl font-bold">{data.movie_title}</h1>

                        {/* Genres */}
                        <div className="flex gap-3">
                            {data.genres?.map((genre: string, index: number) => (
                                <span key={index} className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full text-sm">{genre}</span>
                            ))}
                        </div>

                        {/* Description */}
                        <p className="text-lg text-center max-w-2xl">{data.movie_description}</p>

                        {/* Ratings */}
                        <p className="text-lg font-semibold">Rating: {data.movie_rating}/10</p>

                        {/* Duration */}
                        <p className="text-lg">Duration: {data.movie_duration}</p>
                    </div>
                </>

            }

            </div>
        </>
    )
}