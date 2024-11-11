"use client"
import { Input } from "@/components/ui/input"
import { useState, Dispatch, SetStateAction, JSX, SVGProps } from "react"

import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
  } from "@/components/ui/menubar"

export default function SearchBar(
{
    searchQuery,
    setSearchQuery,
    filter,
    setFilter
}:{
    searchQuery: string,
    setSearchQuery: Dispatch<SetStateAction<string>>,
    filter:string,
    setFilter: Dispatch<SetStateAction<string>>
}

) {
  return (
    <div className="flex flex-row items-center gap-10">
        <div className="flex items-center w-full max-w-sm space-x-2 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 px-3.5 py-2">
        <SearchIcon className="h-4 w-4" />
        <Input type="search" placeholder={"Search " + filter} value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="w-full border-0 h-8 font-medium" />
        </div>
    
        <Menubar>
        <MenubarMenu>
            <MenubarTrigger>Filter</MenubarTrigger>
            <MenubarContent>
            <MenubarRadioGroup value={filter} onValueChange={(value)=>setFilter(value)}>
                <MenubarRadioItem value="movies">Movies</MenubarRadioItem>
                <MenubarRadioItem value="theatres">Theatres</MenubarRadioItem>
            </MenubarRadioGroup>
            </MenubarContent>
        </MenubarMenu>
        
        </Menubar>
    </div>
  )
}

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}