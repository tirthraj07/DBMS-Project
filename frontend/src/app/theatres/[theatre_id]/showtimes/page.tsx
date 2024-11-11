"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState, useEffect } from "react";

export default function TheatreShows({params}:{
    params:{
        theatre_id: string
    }
}){

    const [screens, setScreens] = useState<any[]>([]);
    const [theatreName, setTheatreName] = useState<string>("");
    const [theatreLocation, setTheatreLocation] = useState<string>("");

    useEffect(() => {
      const fetchShowtimeDetails = async () => {
        try{
        const response = await fetch(`/api/theatres/${params.theatre_id}/shows`);
        const data = await response.json();
        console.log(data)
        if(data.error){
            console.log(data.error)
            alert("Couldn't Fetch the Theatre Details");
            window.location.href='/user/home'
        }
        // Assume the API response contains an array of screens, each with an array of showtimes
        setScreens(data.data); // Set screen data with showtimes
        }
        catch(error){
            console.log(error)
            alert("Couldn't Fetch the Theatre Details")
            window.location.href='/user/home'
        }
    };

      const fetchTheatreName = async() => {
        const response = await fetch(`/api/theatres/${params.theatre_id}`)
        const data = await response.json()
        console.log(data);
        setTheatreName(data.theatre_name);
        setTheatreLocation(data.theatre_location);
      }
  
      fetchShowtimeDetails();
      fetchTheatreName()
    }, []);

    function gotoShowtime(showtime_id:string, screen_id:string){
        window.location.href = `/theatres/${params.theatre_id}/screens/${screen_id}/showtimes/${showtime_id}`
    }
  
    return (
      <>
        <div className="relative">
          <div className="w-full min-h-full pt-2 gap-2" style={{ minHeight: "calc(100vh - 5rem)" }}>
            <div className="flex flex-col gap-3 p-5 w-[40%] m-auto border shadow-xl mt-5 mb-20 rounded-2xl">
                    <div className="text-lg font-normal">Theatre Name: <span className="font-semibold">{theatreName}</span></div>

                    <div className="text-lg font-normal">Theatre Location: <span className="font-semibold">{theatreLocation}</span></div>
            </div>
            <h1 className="text-2xl font-bold text-center">Theatre Shows</h1>
            <div className="space-y-8 w-[50%] m-auto mt-10">    
              {screens.map((screen) => (
                <div key={screen.screen_id} className="mb-20">
                  <h2 className="text-lg font-semibold text-center">Screen {screen.screen_name} Showtimes</h2>
                  <Table>
                    <TableCaption>Showtimes for {screen.screen_name}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Movie Title</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {screen.showtimes.map((showtime) => (
                        <TableRow key={showtime.showtime_id} onClick={(e)=>gotoShowtime(showtime.showtime_id, showtime.screen_id)} className="hover:cursor-pointer" >
                          <TableCell>{showtime.movie_title}</TableCell>
                          <TableCell>{new Date(showtime.showtime_start_time).toLocaleString()}</TableCell>
                          <TableCell>{new Date(showtime.showtime_end_time).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );


}