"use client"

import { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AddShowPage() {
    const [movies, setMovies] = useState<any[]>([]);
    const [screens, setScreens] = useState<any[]>([]);

    const [selectedMovieId, setSelectedMovieId] = useState<string | undefined>();
    const [selectedScreenId, setSelectedScreenId] = useState<string | undefined>();
    const [showtimeStartTime, setShowtimeStartTime] = useState<string | undefined>();

    // Pricing state for different seat types
    const [pricing, setPricing] = useState({
        Standard: "",
        Recliner: "",
        Premium: "",
        VIP: ""
    });

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch('/api/movies');
            const data = await response.json();
            setMovies(data.data);
        };

        const fetchScreens = async () => {
            const response = await fetch('/api/theatre/screens');
            const data = await response.json();
            setScreens(data.data);
        };

        fetchMovies();
        fetchScreens();
    }, []);

    const handlePricingChange = (seatType: string, value: string) => {
        setPricing(prev => ({
            ...prev,
            [seatType]: value
        }));
    };

    const handleAddShow = async () => {
        if (!selectedScreenId || !selectedMovieId || !showtimeStartTime || !pricing.Standard || !pricing.Recliner || !pricing.Premium || !pricing.VIP) {
            alert("Please fill all the fields.");
            return;
        }

        const postData = {
            movie_id: selectedMovieId,
            showtime_start_time: showtimeStartTime,
        };

        // Post the showtime data
        const response = await fetch(`/api/theatre/screens/${selectedScreenId}/showtimes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            alert("Failed to add showtime.");
            return;
        }

        const data = await response.json();
        const showtimeId = data.data.showtime_id; // Extract the showtime_id from the response

        // Now post the pricing data
        const pricingData = [
            { price: pricing.Standard, seat_type_id: 1 },
            { price: pricing.Recliner, seat_type_id: 2 },
            { price: pricing.Premium, seat_type_id: 3 },
            { price: pricing.VIP, seat_type_id: 4 }
        ];

        for (const priceEntry of pricingData) {
            const pricingResponse = await fetch(`/api/theatre/screens/${selectedScreenId}/showtimes/${showtimeId}/pricings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(priceEntry),
            });
        
            if (!pricingResponse.ok) {
                const errorData = await pricingResponse.json();
                alert(`Failed to add pricing for seat type ${priceEntry.seat_type_id}: ${errorData.error}`);
            }
        }

        alert("Pricing added successfully!");
        window.location.href='/theatre/shows'
    };

    return (
        <div className="w-full min-h-full flex flex-col justify-center items-center gap-4" style={{ minHeight: "calc(100vh - 5rem)" }}>
            <h1 className="text-2xl font-bold text-center">Add Shows</h1> 

            {/* Select Screen */}
            <Select onValueChange={(value) => setSelectedScreenId(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Screen" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Screens</SelectLabel>
                        {screens.map((screen) => (
                            <SelectItem key={screen.screen_id} value={screen.screen_id}>
                                {screen.screen_name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* Select Movie */}
            <Select onValueChange={(value) => setSelectedMovieId(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Movie" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Movies</SelectLabel>
                        {movies.map((movie) => (
                            <SelectItem key={movie.movie_id} value={movie.movie_id}>
                                {movie.movie_title}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* Select Start Time */}
            <input
                type="datetime-local"
                value={showtimeStartTime}
                onChange={(e) => setShowtimeStartTime(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
            />

            {/* Pricing Inputs */}
            <div className="flex flex-col gap-2">
                <input
                    type="number"
                    placeholder="Standard Price"
                    value={pricing.Standard}
                    onChange={(e) => handlePricingChange("Standard", e.target.value)}
                    className="border border-gray-300 p-2 rounded-md"
                />
                <input
                    type="number"
                    placeholder="Recliner Price"
                    value={pricing.Recliner}
                    onChange={(e) => handlePricingChange("Recliner", e.target.value)}
                    className="border border-gray-300 p-2 rounded-md"
                />
                <input
                    type="number"
                    placeholder="Premium Price"
                    value={pricing.Premium}
                    onChange={(e) => handlePricingChange("Premium", e.target.value)}
                    className="border border-gray-300 p-2 rounded-md"
                />
                <input
                    type="number"
                    placeholder="VIP Price"
                    value={pricing.VIP}
                    onChange={(e) => handlePricingChange("VIP", e.target.value)}
                    className="border border-gray-300 p-2 rounded-md"
                />
            </div>

            {/* Submit Button */}
            <button
                onClick={handleAddShow}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
                Add Show
            </button>
        </div>
    );
}
