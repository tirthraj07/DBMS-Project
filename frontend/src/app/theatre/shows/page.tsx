"use client";
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

export default function TheatreShowsPage() {
  const [screens, setScreens] = useState<any[]>([]);

  useEffect(() => {
    const fetchShowtimeDetails = async () => {
      const response = await fetch('/api/theatre/shows');
      const data = await response.json();

      // Assume the API response contains an array of screens, each with an array of showtimes
      setScreens(data.data); // Set screen data with showtimes
    };

    fetchShowtimeDetails();
  }, []);

  return (
    <>
      <div className="relative">
        <div className="w-full min-h-full pt-2 gap-2" style={{ minHeight: "calc(100vh - 5rem)" }}>
          <h1 className="text-2xl font-bold text-center">Theatre Shows</h1>
          <div className="space-y-8 w-[50%] m-auto mt-10">    
            {screens.map((screen) => (
              <div key={screen.screen_id} className="mb-32">
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
                      <TableRow key={showtime.showtime_id}>
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

        {/* Button to add a new show */}
        <Button
          asChild
          className="absolute z-10 top-[95%] left-[95%] transform -translate-x-1/2 -translate-y-1/2"
          variant={"default"}
        >
          <Link href="/theatre/add-show">Add Show</Link>
        </Button>
      </div>
    </>
  );
}
