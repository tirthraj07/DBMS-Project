import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export default function DesktopNavbar({
    isLoggedIn,
    userRole
}: {
    isLoggedIn: boolean,
    userRole: "user" | "theatre"
}) {
    async function handleLogout() {
        const response = await fetch('/api/user/logout', {
            method: 'POST'
        });
        const data = await response.json();
        if (data.error) {
            console.log(data.error);
            alert(data.error);
        }

        if (data.success) {
            alert("Logout Successful")
            window.location.href = '/user/login'
        }
    }

    return (
        <>
            <header className="absolute z-10 top-0 left-0 flex h-20 w-full shrink-0 items-center px-4 md:px-6" style={{ backgroundColor: "#1c1c84" }}>
                <nav className="flex-1 overflow-auto py-6">
                    <div className="grid gap-4 px-6 grid-rows-1 grid-flow-col">
                        <Link
                            href={isLoggedIn ? userRole == "user" ? "/user/home" : "/theatre/home" : "/user/login"}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-white col-span-2"
                            prefetch={false}
                        >
                            <Image src={"https://cdn-icons-png.flaticon.com/512/6030/6030249.png"} alt="favicon" width={50} height={50} />
                            <span className="sr-only">Ticket Booker</span>
                            <span className="text-2xl font-semibold">Ticket Booker</span>
                        </Link>
                        <div className="flex flex-row-reverse px-4">
                            {isLoggedIn &&
                                <>
                                    <div className="flex justify-center align-middle items-center">
                                        {userRole == "user" &&
                                            <Button variant={"default"} className="text-lg font-medium" style={{ backgroundColor: "#1c1c84" }} asChild>
                                                <Link href={"/user/bookings"}>My Bookings</Link>
                                            </Button>
                                        }

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant={"default"} className="text-lg font-medium" style={{ backgroundColor: "#1c1c84" }}>Logout</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Do you want to logout?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Click 'Logout' to end the session
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        {/* <Link
                                        href={"/logout"}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-white"
                                        prefetch={false}
                                    >
                                        <span className="text-lg font-medium">Logout</span>
                                    </Link> */}
                                    </div>
                                </>
                            }

                            <div className="flex justify-center align-middle">
                                <Link
                                    href={isLoggedIn ? userRole == "user" ? "/user/home" : "/theatre/home" : "/user/login"}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-white"
                                    prefetch={false}
                                >
                                    <span className="text-lg font-medium">{isLoggedIn ? "Home" : "User Login"}</span>
                                </Link>
                            </div>

                            {
                                !isLoggedIn &&
                                <div className="flex justify-center align-middle">
                                    <Link
                                        href={"/theatre/login"}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-white"
                                        prefetch={false}
                                    >
                                        <span className="text-lg font-medium">{"Theatre Login"}</span>
                                    </Link>
                                </div>
                            }


                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}