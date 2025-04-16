'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QRCode from "react-qr-code";


export default function ValidateBooking() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [validationResult, setValidationResult] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!token) return;
        fetch(`/api/bookings/validate?token=${token}`)
            .then(res => res.json())
            .then(data => {
                setValidationResult(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [token]);

    if (loading) return <div className='flex items-center justify-center h-screen text-2xl'>Loading...</div>;

    if (!validationResult || !validationResult.valid) {
        return (
            <div className='flex flex-col items-center justify-center h-screen text-red-500 text-2xl'>
                ❌ Invalid Ticket
            </div>
        );
    }

    const { bookingDetails, bookedSeats } = validationResult.decodedToken;
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
            <div className='bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl text-center'>
                <div className='text-green-500 text-8xl mb-4'>✅</div>
                <h1 className='text-3xl font-bold mb-2'>Ticket is Valid</h1>
                <p className='text-gray-600 mb-6'>Booking ID: {bookingDetails.booking_id}</p>

                <div className='bg-gray-50 p-4 rounded-lg shadow-md text-left'>
                    <h2 className='text-xl font-semibold mb-2'>{bookingDetails.movie_title}</h2>
                    <p><strong>Theatre:</strong> {bookingDetails.theatre_name} - {bookingDetails.theatre_location}</p>
                    <p><strong>Screen:</strong> {bookingDetails.screen_name}</p>
                    <p><strong>Showtime:</strong> {new Date(bookingDetails.showtime_start_time).toLocaleString()}</p>
                    <p><strong>Seats:</strong> {bookedSeats.join(', ')}</p>
                    <p><strong>Customer:</strong> {bookingDetails.customer_full_name} ({bookingDetails.customer_email})</p>
                    <p><strong>Amount Paid:</strong> ₹{bookingDetails.booking_total_amount}</p>
                </div>

                <div className='mt-6'>
                    <div className='flex justify-center'>
                        <QRCode value={`/bookings/validate?token=${token}`} size={150} />
                    </div>
                    <div>
                        <p className='text-sm text-gray-500 mt-2'>Scan to validate</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
