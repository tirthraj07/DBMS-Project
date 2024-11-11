"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link";


export default function TheatreScreensPage(){
    const [ screensData, setScreensData ] = useState<any[]>();
    useEffect(()=>{
        const fetchScreensData = async () => {
            const response = await fetch('/api/theatre/screens')
            const data = await response.json();
            setScreensData(data.data);
            console.log(data.data)

        }

        fetchScreensData()

    },[])

    return (
        <div className="relative">
        <div className="w-full min-h-full pt-2 gap-2" style={{minHeight:"calc(100vh - 5rem)"}}>
            <h1 className="text-2xl font-bold text-center">Theatre Screens</h1>
            {(screensData==undefined || screensData.length === 0)&&
                <h1 className="text-center">No screens found</h1>
            }
            {screensData && screensData.length > 0 &&
                <div className="pt-3 ps-5 w-full flex flex-row flex-wrap gap-6">
                    {screensData.map((screen,index) => {
                        //theatre_id, theatre_name, screen_id, screen_name, screen_total_seats
                        
                        return(
                            <Button asChild key={index} variant={"ghost"} className="min-w-32 min-h-20 flex flex-col border">
                                <Link href={`/theatre/screens/${screen.screen_id}`}>
                                    <div className="text-xl font-semibold">Screen {screen.screen_name}</div>
                                    <div className="text-md font-normal font-mono">Total Seats: {screen.screen_total_seats}</div>
                                </Link>
                            </Button>
                        )
                    })}
                </div>
            
            }
        
        </div>            

        <Button asChild variant={"default"} className="absolute top-[95%] left-[95%] transform -translate-x-1/2 -translate-y-1/2">
            <Link href={"/theatre/add-screen"}>Add Screen</Link>
        </Button>
        </div>
    )
}