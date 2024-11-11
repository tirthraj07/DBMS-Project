const express = require('express');
const v1_router = express.Router();
const { query } = require('../configuration/database');
const Cryptography = require('../lib/crypto_utils')


v1_router.get('/seat-types', async (req, res) => {
    try {
        const result = await query('SELECT seat_type_id, seat_type_name FROM seat_types');
        res.json(result);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
});

v1_router.get('/search-theatres/search',(async (req, res) => {
        const { theatre_name } = req.query;

        try {
            if (theatre_name) {
                const result = await query('SELECT * FROM theatres WHERE theatre_name  LIKE ?', [`%${theatre_name}%`]);
                res.json(result);
            } else {
                res.json([]);  // Return an empty array if no query parameter is provided
            }
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
}));


v1_router.get('/showtimes', async (req, res) => {
    try {
        // Get the movie_id from the query parameters
        const { movie_id } = req.query;

        // If movie_id is provided, fetch showtime details for the movie
        if (movie_id) {
            const fetchShowtimesQuery = `
                SELECT * FROM showtimes_details 
                WHERE movie_id = ?
            `;
            const results = await query(fetchShowtimesQuery, [movie_id]);

            // Return showtime details or an empty array if no showtimes found
            return res.status(200).json({
                data: results.length > 0 ? results : []
            });
        } else {
            // If no movie_id is provided, return an error response
            return res.status(400).json({
                error: 'movie_id is required'
            });
        }
    } catch (error) {
        console.error('Error fetching showtime details:', error);
        return res.status(500).json({
            message: 'Server error',
        });
    }
});

v1_router.route('/theatres')
    .get(async (req, res) => {
        try {
            const result = await query('SELECT * FROM theatres');
            res.json(result);
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    })
    .post(async (req, res) => {
        const { theatre_name, theatre_location } = req.body;
        try {
            if(!theatre_name, !theatre_location){
                res.status(400).json({error:"Insufficient Payload"})
            }

            const result = await query('INSERT INTO theatres (theatre_name, theatre_location) VALUES (?, ?)', [theatre_name, theatre_location]);
            const createdTheatre = await query('SELECT theatre_id, theatre_name, theatre_location FROM theatres WHERE theatre_id = ?', [result.insertId]);
            res.json(createdTheatre[0]);
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    });

// /theatres/:theatre_id (GET, PATCH)
v1_router.route('/theatres/:theatre_id')
    .get(async (req, res) => {
        const { theatre_id } = req.params;
        try {
            const result = await query('SELECT theatre_id, theatre_name, theatre_location FROM theatres WHERE theatre_id = ?', [theatre_id]);
            if (result.length === 0) {
                return res.status(404).json({ "error": "theatre not found" });
            }
            res.json(result[0]);
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    })
    .patch(async (req, res) => {
        const { theatre_id } = req.params;
        const { theatre_name, theatre_location } = req.body;
        try {
            const result = await query('SELECT theatre_id FROM theatres WHERE theatre_id = ?', [theatre_id]);
            if (result.length === 0) {
                return res.status(404).json({ "error": "theatre not found" });
            }
            await query('UPDATE theatres SET theatre_name = ?, theatre_location = ? WHERE theatre_id = ?', [theatre_name || result[0].theatre_name, theatre_location || result[0].theatre_location, theatre_id]);
            res.json({ "success": "Theatre updated successfully" });
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    });

// /theatres/:theatre_id/users (GET, POST)
v1_router.route('/theatres/:theatre_id/users')
    .get(async (req, res) => {
        const { theatre_id } = req.params;
        try {
            const result = await query('SELECT theatre_user_id, theatre_user_full_name, theatre_user_email FROM theatre_users WHERE theatre_id = ?', [theatre_id]);
            res.json(result);
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    })
    .post(async (req, res) => {
        const { theatre_user_full_name, theatre_user_email, theatre_user_password } = req.body;
        const { theatre_id } = req.params;
        try {
            if(!theatre_user_full_name || !theatre_user_email || !theatre_user_password){
                res.status(400).json({error:"Insufficient payload"})
            }

            const cryptograph = new Cryptography()
            
            const hashedPassword = cryptograph.generateSaltHash(theatre_user_password);

            const result = await query('INSERT INTO theatre_users (theatre_user_full_name, theatre_user_email, theatre_user_password, theatre_id) VALUES (?, ?, ?, ?)', 
                [theatre_user_full_name, theatre_user_email, hashedPassword, theatre_id]);

            const newUser = await query('SELECT theatre_user_id, theatre_user_full_name, theatre_user_email, theatre_id FROM theatre_users WHERE theatre_user_id = ?', 
                [result.insertId]);

            res.json({ success: "User created successfully", user: newUser[0] });

        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    });

v1_router.route('/theatres/:theatre_id/users/:user_id')
.get(async (req, res) => {
    const { theatre_id,user_id } = req.params;
    try {
        const [user] = await query('SELECT theatre_user_id, theatre_user_full_name, theatre_user_email FROM theatre_users WHERE theatre_id = ? AND theatre_user_id = ?', [theatre_id, user_id]);
        if(!user){
            res.status(404).json({ "error": "theatre user not found" });            
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

// /theatres/:theatre_id/screens (GET, POST)
v1_router.route('/theatres/:theatre_id/screens')
    .get(async (req, res) => {
        const { theatre_id } = req.params;
        try {
            const result = await query('SELECT theatre_id, theatre_name, screen_id, screen_name, screen_total_seats FROM screen_details WHERE theatre_id = ?', [theatre_id]);
            res.json(result);
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    })
    .post(async (req, res) => {
        const { screen_name, screen_total_seats,no_of_rows,max_row_seats } = req.body;
        const { theatre_id } = req.params;
        try {
            const result = await query('INSERT INTO screens (screen_name, screen_total_seats, theatre_id, no_of_rows, max_row_seats) VALUES (?, ?, ?, ?, ?)', [screen_name, screen_total_seats, theatre_id,no_of_rows,max_row_seats]);
            const createdScreen = {
                screen_id: result.insertId,
                theatre_id,
                screen_name,
                screen_total_seats,
                no_of_rows,
                max_row_seats
            };
            res.json({ "screen": createdScreen });
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    });

// /theatres/:theatre_id/screens/:screen_id (GET, PATCH)
v1_router.route('/theatres/:theatre_id/screens/:screen_id')
    .get(async (req, res) => {
        const { screen_id } = req.params;
        try {
            const result = await query('SELECT * FROM screens WHERE screen_id = ?', [screen_id]);
            res.json(result[0]);
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    })
    .patch(async (req, res) => {
        const { screen_id } = req.params;
        const { screen_name, screen_total_seats } = req.body;
        try {
            await query('UPDATE screens SET screen_name = ?, screen_total_seats = ? WHERE screen_id = ?', [screen_name, screen_total_seats, screen_id]);
            res.json({ "success": "Screen updated successfully" });
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    });

// /theatres/:theatre_id/screens/:screen_id/seats (GET, POST)
v1_router.route('/theatres/:theatre_id/screens/:screen_id/seats')
    .get(async (req, res) => {
        const { screen_id } = req.params;
        try {
            const result = await query('SELECT seat_id,row_num,seat_number,seat_type_id,seat_type_name FROM seat_details WHERE screen_id = ?', [screen_id]);
            res.json(result);
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    })
    .post(async (req, res) => {
        const { screen_id } = req.params;
        const seats = req.body.seats; // Array of { row_num, seat_number, seat_type_id }
        try {
            for (let seat of seats) {
                await query('INSERT INTO seats (row_num, seat_number, seat_type_id, screen_id) VALUES (?, ?, ?, ?)', [seat.row_num, seat.seat_number, seat.seat_type_id, screen_id]);
            }
            res.json({ "success": "Seats added successfully" });
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    });


// /theatres/:theatre_id/screens/:screen_id/showtimes (GET, POST)
v1_router.route('/theatres/:theatre_id/screens/:screen_id/showtimes')
    .get(async (req, res) => {
        const { screen_id } = req.params;
        const { upcoming } = req.query;  // query parameter for filtering upcoming showtimes
        try {
            let queryStr = `
                SELECT showtime_id, screen_id, movie_id, showtime_start_time, showtime_end_time, movie_title
                FROM showtimes_details
                WHERE screen_id = ?
            `;
            let queryParams = [screen_id];

            // Filter for upcoming showtimes if the query param 'upcoming' is true
            if (upcoming === 'true') {
                queryStr += ' AND showtime_start_time >= NOW()';
            }

            const result = await query(queryStr, queryParams);
            res.json(result);
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    })
    .post(async (req, res) => {
        const { screen_id } = req.params;
        const { movie_id, showtime_start_time } = req.body;

        try {
            // Check for valid payload
            if (!movie_id || !showtime_start_time) {
                return res.status(400).json({ "error": "Insufficient payload" });
            }

            // Retrieve movie duration from the movies table
            const movieResult = await query('SELECT movie_duration FROM movies WHERE movie_id = ?', [movie_id]);
            if (movieResult.length === 0) {
                return res.status(404).json({ "error": "Movie not found" });
            }
            const movieDuration = movieResult[0].movie_duration;  // movie_duration is of type TIME

            // Convert movie_duration (MySQL TIME format) to minutes
            const durationParts = movieDuration.split(':');
            const hours = parseInt(durationParts[0], 10);
            const minutes = parseInt(durationParts[1], 10);
            const totalMinutes = hours * 60 + minutes;

            // Calculate showtime_end_time by adding movie_duration to showtime_start_time
            const showtimeEndTime = new Date(new Date(showtime_start_time).getTime() + totalMinutes * 60000);  // movie_duration in minutes

            // Insert new showtime into the database
            const result = await query(
                'INSERT INTO showtimes (screen_id, movie_id, showtime_start_time, showtime_end_time) VALUES (?, ?, ?, ?)',
                [screen_id, movie_id, showtime_start_time, showtimeEndTime]
            );

            const createdShowtime = {
                showtime_id: result.insertId,
                screen_id,
                movie_id,
                showtime_start_time,
                showtime_end_time: showtimeEndTime
            };

            res.json({ "showtime": createdShowtime });
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    });


// /theatres/:theatre_id/screens/:screen_id/showtimes/:showtime_id (GET, PATCH)
v1_router.route('/theatres/:theatre_id/screens/:screen_id/showtimes/:showtime_id')
    .get(async (req, res) => {
        const { showtime_id } = req.params;

        try {
            const result = await query(
                'SELECT * FROM showtimes_details WHERE showtime_id = ?',
                [showtime_id]
            );

            if (result.length === 0) {
                return res.status(404).json({ "error": "Showtime not found" });
            }

            res.json(result[0]);
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    })
    .patch(async (req, res) => {
        const { showtime_id } = req.params;
        const { movie_id, screen_id, showtime_start_time, showtime_end_time } = req.body;

        try {
            // Retrieve the existing showtime data
            const existingShowtime = await query('SELECT * FROM showtimes WHERE showtime_id = ?', [showtime_id]);

            if (existingShowtime.length === 0) {
                return res.status(404).json({ "error": "Showtime not found" });
            }

            // Update fields if they are provided, else keep the existing values
            const updatedMovieId = movie_id || existingShowtime[0].movie_id;
            const updatedScreenId = screen_id || existingShowtime[0].screen_id;
            const updatedStartTime = showtime_start_time || existingShowtime[0].showtime_start_time;
            const updatedEndTime = showtime_end_time || existingShowtime[0].showtime_end_time;

            // Update the showtime record in the database
            await query(
                'UPDATE showtimes SET movie_id = ?, screen_id = ?, showtime_start_time = ?, showtime_end_time = ? WHERE showtime_id = ?',
                [updatedMovieId, updatedScreenId, updatedStartTime, updatedEndTime, showtime_id]
            );

            res.json({ "success": "Showtime updated successfully" });
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    });

    // /theatres/:theatre_id/screens/:screen_id/showtimes/:showtime_id/pricing (GET, POST)
v1_router.route('/theatres/:theatre_id/screens/:screen_id/showtimes/:showtime_id/pricings')
    .get(async (req, res) => {
        const { showtime_id } = req.params;

        try {
            const result = await query(
                'SELECT pricing_id, price, seat_type_id FROM pricings WHERE showtime_id = ?',
                [showtime_id]
            );

            if (result.length === 0) {
                return res.status(404).json({ "error": "Pricing not found for this showtime" });
            }

            res.json({
                showtime_id,
                screen_id: req.params.screen_id,
                pricing: result
            });
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    })
    .post(async (req, res) => {
        const { showtime_id, screen_id } = req.params;
        const { price, seat_type_id } = req.body;

        try {
            if (!price || !seat_type_id) {
                return res.status(400).json({ "error": "Price and seat_type_id are required" });
            }

            // Insert new pricing into the database
            const result = await query(
                'INSERT INTO pricings (showtime_id, screen_id, price, seat_type_id) VALUES (?, ?, ?, ?)',
                [showtime_id, screen_id, price, seat_type_id]
            );

            // Fetch the newly created pricing
            const newPricing = await query(
                'SELECT pricing_id, price, seat_type_id FROM pricings WHERE pricing_id = ?',
                [result.insertId]
            );

            res.json({
                showtime_id,
                screen_id,
                pricing: newPricing[0]
            });
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    });



v1_router.route('/theatres/:theatre_id/screens/:screen_id/showtimes/:showtime_id/pricings/:pricing_id')
    .get(async (req, res) => {
        const { pricing_id } = req.params;

        try {
            const result = await query(
                'SELECT pricing_id, price, screen_id, showtime_id, seat_type_id FROM pricings WHERE pricing_id = ?',
                [pricing_id]
            );

            if (result.length === 0) {
                return res.status(404).json({ "error": "Pricing not found" });
            }

            res.json(result[0]);
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    })
    .patch(async (req, res) => {
        const { pricing_id } = req.params;
        const { price, seat_type_id } = req.body;

        try {
            // Fetch the existing pricing record
            const existingPricing = await query('SELECT * FROM pricings WHERE pricing_id = ?', [pricing_id]);

            if (existingPricing.length === 0) {
                return res.status(404).json({ "error": "Pricing not found" });
            }

            // Update only the provided fields
            const updatedPrice = price || existingPricing[0].price;
            const updatedSeatTypeId = seat_type_id || existingPricing[0].seat_type_id;

            // Update the pricing record in the database
            await query(
                'UPDATE pricings SET price = ?, seat_type_id = ? WHERE pricing_id = ?',
                [updatedPrice, updatedSeatTypeId, pricing_id]
            );

            res.json({ 
                "success": "Pricing updated successfully", 
                "pricing": { 
                    pricing_id, 
                    price: updatedPrice, 
                    seat_type_id: updatedSeatTypeId, 
                    screen_id: req.params.screen_id, 
                    showtime_id: req.params.showtime_id 
                }
            });
        } catch (err) {
            res.status(500).json({ "error": err.message });
        }
    });



module.exports = v1_router;
