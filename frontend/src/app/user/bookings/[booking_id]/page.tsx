'use client';

import { useEffect, useState } from 'react';
import QRCode from "react-qr-code";

const BookingPage = ({ params }: { params: { booking_id: string } }) => {
    const [booking, setBooking] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await fetch(`/api/bookings/${params.booking_id}`);
                const data = await response.json();
                setBooking(data);
            } catch (error) {
                console.error('Error fetching booking details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookingDetails();
    }, [params.booking_id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!booking) {
        return <div>Booking not found.</div>;
    }

    const ticketValidationUrl = `/bookings/validate?token=${booking.ticketToken}`;

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-semibold text-center mb-4">Your Event Ticket</h1>
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Booking Details</h2>
                <p><strong>Booking ID:</strong> {booking.bookingDetails.booking_id}</p>
                <p><strong>Movie Title:</strong> {booking.bookingDetails.movie_title}</p>
                <p><strong>Showtime:</strong> {new Date(booking.bookingDetails.showtime_start_time).toLocaleString()} - {new Date(booking.bookingDetails.showtime_end_time).toLocaleString()}</p>
                <p><strong>Theatre:</strong> {booking.bookingDetails.theatre_name} ({booking.bookingDetails.theatre_location})</p>
                <p><strong>Screen:</strong> {booking.bookingDetails.screen_name}</p>
                <p><strong>Seats:</strong> {booking.bookedSeats.join(', ')}</p>
                <p><strong>Total Amount:</strong> ₹{booking.bookingDetails.booking_total_amount}</p>
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Customer Details</h2>
                <p><strong>Name:</strong> {booking.bookingDetails.customer_full_name}</p>
                <p><strong>Email:</strong> {booking.bookingDetails.customer_email}</p>
                <p><strong>Phone:</strong> {booking.bookingDetails.customer_phone}</p>
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Ticket Validation</h2>
                <p>
                    To validate your ticket, please visit the following link:
                    <a href={ticketValidationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Validate Ticket
                    </a>
                </p>
                <div className="mt-2 flex justify-center">
                    <QRCode value={ticketValidationUrl} size={256} />
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
