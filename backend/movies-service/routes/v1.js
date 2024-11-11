const express = require('express');
const v1_router = express.Router();
const {query} = require('../configuration/database')
const { 
    getMovies,
    getMovie,
    getGenres,
    getGenre,
    getMovieGenres,
    getMovieImages,
    addNewMovie,
    addMovieGenres,
    addNewImages
 }  = require("../controller/v1/movies_controller")

v1_router.get('/movies', getMovies)

v1_router.get('/search-movies/search', async (req, res) => {
    try {
        // Get the movie_name from the query parameters
        const { movie_name } = req.query;

        // If movie_name is provided, search for matching movies using the LIKE operator
        if (movie_name) {
            const searchQuery = `
                SELECT m.*, 
                       GROUP_CONCAT(DISTINCT md.movie_genre_name) AS genres,
                       GROUP_CONCAT(DISTINCT img.movie_image_location) AS images
                FROM movies m
                LEFT JOIN movie_details md ON m.movie_id = md.movie_id
                LEFT JOIN movie_image_details img ON m.movie_id = img.movie_id
                WHERE m.movie_title LIKE ?
                GROUP BY m.movie_id
            `;
            const results = await query(searchQuery, [`%${movie_name}%`]); // Wildcards for partial match

            // Format results by splitting genres and images (if multiple)
            const formattedResults = results.map(movie => ({
                ...movie,
                genres: movie.genres ? movie.genres.split(',') : [],
                images: movie.images ? movie.images.split(',') : []
            }));

            return res.status(200).json({
                success: true,
                data: formattedResults,
            });
        } else {
            // If no movie_name is provided, return an empty array
            return res.status(200).json({
                success: true,
                data: [],
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});


v1_router.get('/movies/:id', getMovie)
v1_router.get('/movies/:id/genres', getMovieGenres) 
v1_router.get('/movies/:id/images', getMovieImages)

v1_router.get('/genres', getGenres)
v1_router.get('/genres/:id', getGenre)

v1_router.post('/movies', addNewMovie)
v1_router.post('/movies/:id/genres', addMovieGenres) 
v1_router.post('/movies/:id/images', addNewImages)

module.exports = v1_router