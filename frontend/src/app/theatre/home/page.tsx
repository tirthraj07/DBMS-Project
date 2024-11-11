"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { useState, useEffect } from "react"

export default function TheatreHomePage(){
    const [theatreData, setTheatreData] = useState<any>(null);
    useEffect(()=>{
        
        const fetchAccountDetails = async() =>{
            try{
                const response = await fetch('/api/theatre/account')
                const data = await response.json()
                setTheatreData(data);
                console.log(data)
            }
            catch(error){
                console.log(error);
                //alert("Failed to fetch account details")
            }
        }
        
        fetchAccountDetails()
    },[])
    
    return(
        <>
            <div className="w-full min-h-full flex flex-row justify-center items-stretch gap-2" style={{minHeight:"calc(100vh - 5rem)"}}>
                <div className="flex-grow-[1] flex justify-center items-center">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Theatre Credentials</CardTitle>
                        <CardDescription>You are logged in as follows</CardDescription>
                    </CardHeader>
                    {theatreData &&
                        <>
                        <CardContent>
 
                            
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <div>Name</div>
                                    <div className="font-mono">{theatreData.theatre_user_full_name}</div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <div>Email</div>
                                    <div className="font-mono">{theatreData.theatre_user_email}</div>
                                </div>
                            </div>                        
                        </CardContent>
                        <CardFooter className="border-t-2 pt-2">
                            <div className="flex flex-col space-y-1.5 border-r-2">
                                <div>Theatre</div>
                                <div className="font-mono">{theatreData.theatre_name}</div>
                            </div>
                            <div className="flex flex-col space-y-1.5 ml-2">
                                <div>Theatre</div>
                                <div className="font-mono">{theatreData.theatre_location}</div>
                            </div>
                        </CardFooter>
                    </>
                    }
                    </Card>
                </div>
                <div className="flex-grow-[1] flex justify-center items-center gap-9">
                    {/* <div className="border rounded-xl h-52 w-52 hover:border-black hover:cursor-pointer transition-all flex justify-center items-center">
                        Goto Screens
                    </div> */}
                    <Button asChild variant={"outline"} className="h-52 w-52 rounded-2xl text-xl font-semibold transition-all hover:bg-blue-600 hover:text-white">
                        <Link href={"/theatre/screens"}>Screens</Link>
                    </Button>
                    <Button asChild variant={"outline"} className="h-52 w-52 rounded-2xl text-xl font-semibold transition-all hover:bg-red-600 hover:text-white">
                        <Link href={"/theatre/shows"}>Shows</Link>
                    </Button>
                </div>
            </div>
        </>
    )
}