"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

type Booking = {
    booking_id: number;
    booking_total_seats: number;
    booking_date: string;
    booking_total_amount: string;
    customer_full_name: string;
    movie_title: string;
    movie_director_name: string;
    showtime_start_time: string;
    showtime_end_time: string;
    theatre_name: string;
    theatre_location: string;
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBookings() {
            try {
                const res = await fetch("/api/user/bookings");
                if (!res.ok) {
                    throw new Error("Failed to fetch bookings");
                }
                const data = await res.json();
                setBookings(data.bookings);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500">
                <p className="text-white text-xl">Error: {error}</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 p-8">
            <h1 className="text-4xl font-bold text-white text-center mb-10">
                My Movie Tickets
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bookings.map((booking) => (
                    <Link
                        key={booking.booking_id}
                        href={`/user/bookings/${booking.booking_id}`}
                    >
                        <div
                            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer"
                        >
                            {/* Decorative perforation at the top */}
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-50"></div>
                            <div className="p-6">
                                <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
                                    {booking.movie_title}
                                </h2>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-semibold">Director:</span> {booking.movie_director_name}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-semibold">Showtime:</span>{" "}
                                    {new Date(booking.showtime_start_time).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}{" "}
                                    -{" "}
                                    {new Date(booking.showtime_end_time).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-semibold">Date:</span>{" "}
                                    {new Date(booking.booking_date).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-semibold">Seats:</span> {booking.booking_total_seats}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-semibold">Total Amount:</span> ₹{" "}
                                    {booking.booking_total_amount}
                                </p>
                            </div>
                            {/* Ticket footer with theatre details */}
                            <div className="bg-gray-100 px-4 py-2 text-center text-sm font-semibold border-t border-gray-200">
                                {booking.theatre_name} | {booking.theatre_location}
                            </div>
                            {/* Decorative perforation at the bottom */}
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-50"></div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
