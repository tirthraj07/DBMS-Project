"use client"
import HomePage from "@/components/HomePage/homepage";
import SearchBar from "@/components/Searchbar/Searchbar";
import SearchPage from "@/components/SearchPage/SearchPage";
import { useState, useEffect } from "react";

export default function HomePageRoute(){

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filter, setFilter] = useState<string>("movies");

    const [showHomePage, setShowHomePage] = useState<boolean>(true);

    useEffect(()=>{

        if(searchQuery.trim() != ""){
            setShowHomePage(false);
        }
        else{
            setShowHomePage(true);
        }

    },[searchQuery])

    return(
        <>
           <div className="border border-black w-full min-h-full flex flex-col pt-5 items-center gap-5" style={{minHeight:"calc(100vh - 5rem)"}}>
            <SearchBar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filter={filter}
                setFilter={setFilter}
            />

                <div className="w-full"> 
                    {showHomePage? <HomePage /> : <SearchPage searchQuery={searchQuery} filter={filter}/>}
                </div>

            </div>
        </>
    )
}