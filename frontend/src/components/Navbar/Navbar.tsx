'use client';

import { useMediaQuery } from "@/hooks/use-media-query";
import DesktopNavbar from "./DesktopNavbar"
import MobileNavbar from "./MobileNavbar";

interface NavbarProps {
    isLoggedIn: boolean;
    userRole: "user" | "theatre"
}

export default function Navbar({ isLoggedIn, userRole }: NavbarProps) {

    return (
        <>
            <DesktopNavbar isLoggedIn={isLoggedIn} userRole={userRole} />
        </>
    );
}
