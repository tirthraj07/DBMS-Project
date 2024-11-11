'use client';

import { useMediaQuery } from "@/hooks/use-media-query"; 
import DesktopNavbar from "./DesktopNavbar"
import MobileNavbar from "./MobileNavbar";

interface NavbarProps {
    isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {

    return (
        <>
            <DesktopNavbar isLoggedIn={isLoggedIn} />
        </>
    );
}
