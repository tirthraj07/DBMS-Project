const express = require('express');
const v1_router = express.Router();
const { query } = require('../configuration/database');

// Fetch booking details by booking_id
v1_router.get('/bookings/:booking_id', async (req, res) => {
    const { booking_id } = req.params;
    
    try {
        const bookingDetailsQuery = `
            SELECT * 
            FROM booking_details 
            WHERE booking_id = ?
        `;
        const bookingSeatsQuery = `
            SELECT seat_id 
            FROM booking_seats 
            WHERE booking_id = ?
        `;

        const bookingDetails = await query(bookingDetailsQuery, [booking_id]);
        const bookedSeats = await query(bookingSeatsQuery, [booking_id]);

        if (bookingDetails.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.json({
            bookingDetails: bookingDetails[0],
            bookedSeats: bookedSeats.map(seat => seat.seat_id),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Fetch bookings by customer_id
v1_router.get('/bookings/customer/:customer_id', async (req, res) => {
    const { customer_id } = req.params;

    try {
        const bookingsQuery = `
            SELECT * 
            FROM booking_details 
            WHERE customer_id = ?
        `;
        const bookings = await query(bookingsQuery, [customer_id]);

        if (bookings.length === 0) {
            return res.status(404).json([]);
        }

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Fetch bookings by showtime_id
v1_router.get('/bookings/showtimes/:showtime_id', async (req, res) => {
    const { showtime_id } = req.params;

    try {
        const bookingsQuery = `
            SELECT * 
            FROM bookings 
            WHERE showtime_id = ?
        `;
        const bookings = await query(bookingsQuery, [showtime_id]);

        if (bookings.length === 0) {
            return res.status(404).json([]);
        }

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Book seats for a showtime 
v1_router.post('/bookings/showtimes/:showtime_id', async (req, res) => {
    const { showtime_id } = req.params;
    const { customer_id, seat_ids } = req.body;  // Expecting seat_ids as an array

    try {
        // Step 1: Validate that seats are available
        const seatCheckQuery = `
            SELECT seat_id FROM booking_seats 
            WHERE seat_id IN (?) AND showtime_id = ?
        `;
        const bookedSeats = await query(seatCheckQuery, [seat_ids, showtime_id]);
        console.log(bookedSeats)

        if (bookedSeats && bookedSeats.length > 0) {
            return res.status(400).json({ error: "One or more seats are already booked" });
        }

        // Step 2: Fetch screen_id from showtimes table
        const screenQuery = `SELECT screen_id FROM showtimes WHERE showtime_id = ?`;
        const [{ screen_id }] = await query(screenQuery, [showtime_id]);
        

        // Step 3: Fetch seat_type_id for each seat
        const seatTypeQuery = `
            SELECT seat_id, seat_type_id FROM seats 
            WHERE seat_id IN (?)
        `;
        const seatTypes = await query(seatTypeQuery, [seat_ids]);
        console.log(seatTypes)

        // Step 4: Fetch price for each seat type
        const pricingQuery = `
            SELECT price, seat_type_id FROM pricings 
            WHERE showtime_id = ? AND screen_id = ? AND seat_type_id IN (?)
        `;
        const seatTypeIds = seatTypes.map(seat => seat.seat_type_id);
        console.log(seatTypeIds)
        const pricingData = await query(pricingQuery, [showtime_id, screen_id, seatTypeIds]);

        // Create a map of seat_type_id to price for easy lookup
        const priceMap = pricingData.reduce((map, pricing) => {
            map[pricing.seat_type_id] = Number(pricing.price);
            return map;
        }, {});

        console.log(priceMap)
        // Step 5: Calculate total amount
        let totalAmount = 0;
        seatTypes.forEach(seat => {
            totalAmount += priceMap[seat.seat_type_id];
        });

        // Step 6: Insert into bookings table
        const bookingInsertQuery = `
            INSERT INTO bookings (booking_total_seats, booking_total_amount, customer_id, showtime_id)
            VALUES (?, ?, ?, ?)
        `;
        const bookingResult = await query(bookingInsertQuery, [seat_ids.length, totalAmount, customer_id, showtime_id]);

        const booking_id = bookingResult.insertId;

        // Step 7: Insert into booking_seats table
        const seatInsertQuery = `
            INSERT INTO booking_seats (booking_id, seat_id, showtime_id)
            VALUES (?, ?, ?)
        `;

        const seatInsertPromises = seat_ids.map(seat_id => {
            return query(seatInsertQuery, [booking_id, seat_id, showtime_id]);
        });

        await Promise.all(seatInsertPromises);

        // Booking successful
        res.status(201).json({ message: "Booking successful" });
    } catch (error) {
        if (error.sqlState === '45000') {
            // Handle custom error from the stored procedure
            res.status(400).json({ error: error.sqlMessage });
        } else {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
});


// Fetch booked seats by showtime_id
v1_router.get('/bookings/showtimes/:showtime_id/seats', async (req, res) => {
    const { showtime_id } = req.params;

    try {
        const bookedSeatsQuery = `
            SELECT seat_id 
            FROM booking_seats 
            WHERE showtime_id = ?
        `;
        const bookedSeats = await query(bookedSeatsQuery, [showtime_id]);

        if (bookedSeats.length === 0) {
            return res.status(404).json([]);
        }

        console.log(bookedSeats)

        res.json(bookedSeats.map(seat => seat.seat_id));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = v1_router;
