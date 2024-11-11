import Link from "next/link"
import favicon from "../../../public/vercel.svg"
import Image from "next/image"
import { useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation'


import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"

export default function MobileNavbar({
    isLoggedIn
}:{
    isLoggedIn: boolean
}){
    const router = useRouter()
    const pathname = usePathname()

    function handleLogin(){
        router.push('/user/login')
    }

    function handleLogout(){
        router.push('/user/logout')
    }


    return(
        <>
           <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6" style={{backgroundColor:"#322E34"}}>
                <nav className="flex-1 overflow-auto py-6">
                    <div className="grid gap-4 px-1 grid-rows-1 grid-flow-col">
                        <Link
                            href="/"
                            className="flex items-center gap-3 rounded-lg py-2 text-white col-span-11"
                            prefetch={false}
                        >
                            <Image src={favicon.src} alt="favicon" width={30} height={30}/>
                            <span className="sr-only">Persistent Systems</span>
                            <span className="text-xl font-semibold">Persistent</span>
                        </Link>
                        <div className="col-span-1 grid grid-flow-col px-4">
                            <div className="flex justify-center align-middle">
                                <Drawer direction="right">
                                    <DrawerTrigger>
                                        <MenuIcon color="white" />
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                        <DrawerTitle>Navigation</DrawerTitle>
                                        </DrawerHeader>
                                        <div className="w-full h-full overflow-auto flex flex-col justify-start items-start p-5 gap-5">
                                            {isLoggedIn&& 
                                            <div className="flex justify-center align-middle">
                                                <Link
                                                    href="/user/home"
                                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-black"
                                                    prefetch={false}
                                                >
                                                    <span className={`text-lg ${pathname.includes('/mycard')?'font-bold':''}`}>Home</span>
                                                </Link>
                                            </div>
                                            }

                                        </div>
                                        <DrawerFooter>
                                        {isLoggedIn?<><Button onClick={handleLogout}>Logout</Button></>:<><Button onClick={handleLogin}>Login</Button></>}
                                        
                                        <DrawerClose className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"> 
                                            Close
                                        </DrawerClose>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>                   
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        
       </>
    )
}