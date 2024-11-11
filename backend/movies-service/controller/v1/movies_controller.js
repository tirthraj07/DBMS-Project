const { query } = require('../../configuration/database')

const getMovies = async (req, res)=>{
    const urlQuery = req.query;

    let order_by = 'movie_id'; 
    let order_direction = 'ASC';

    switch(urlQuery.sort) {
        case 'ratings':
            order_by = 'movie_rating';
            break;
        case 'duration':
            order_by = 'movie_duration';
            break;
        default:
            order_by = 'movie_id'; 
    }

    if (urlQuery.order && urlQuery.order.toUpperCase() === 'DESC') {
        order_direction = 'DESC';
    } else {
        order_direction = 'ASC'; 
    }

    const sqlQuery = `SELECT * FROM movies ORDER BY ${order_by} ${order_direction}`;
    
    try {
        const result = await query(sqlQuery); 
        res.json({ data: result });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const getMovie = async(req, res) => {
    try{
        const queryParams = req.params;

        const id = queryParams.id;

        const fetchMovieQuery = await query('SELECT * FROM movies WHERE movie_id = ?', [id]);
        
        if(fetchMovieQuery.length == 0){
            res.status(404).json({error: "Movie not found"})
            return;
        }

        const genres = [];
        const fetchMovieGenres = await query('SELECT movie_genre_name FROM movie_details WHERE movie_id = ?', [id]);
        for(let i=0; i<fetchMovieGenres.length; i++){
            genres.push(fetchMovieGenres[i].movie_genre_name);
        }
        
        const images = [];
        const fetchMovieImages = await query('SELECT movie_image_location FROM movie_image_details WHERE movie_id = ?', [id]);
        for(let i=0; i<fetchMovieImages.length; i++){
            images.push(fetchMovieImages[i].movie_image_location);
        }

        let response = {};
        if(fetchMovieQuery.length >= 0){
            let movie_details = fetchMovieQuery[0];
            response = {...movie_details,genres:genres, images:images};
        } 
        res.json(response);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getGenres = async (req,res)=>{
    try{
        const genres = await query('SELECT * FROM movie_genres ORDER BY movie_genre_id');
        let response = [];
        for(let genre of genres){
            response.push({id:genre.movie_genre_id, genre:genre.movie_genre_name});
        }
        res.json({genres:response});    
    }
    catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getGenre = async(req, res)=>{
    try{
        const id = req.params.id;
        const fetchGenre = (await query('SELECT movie_genre_name FROM movie_genres WHERE movie_genre_id = ?', [id]))[0]?.movie_genre_name;
        if(!fetchGenre){
            res.status(404).json({error:'Genre not found'});
            return;
        }
        const fetchMovies = await query('SELECT movie_id FROM movie_genre_mapping WHERE movie_genre_id = ?', [id]);
        const response = [];
        for(let movie of fetchMovies){
            response.push(movie.movie_id);
        }
        res.send({genre:fetchGenre ,movie_ids:response})
    }
    catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getMovieImages = async(req,res)=>{
    try{
        const id = req.params.id;

        const fetchMovie = (await query('SELECT movie_title from movies WHERE movie_id = ?', [id]))[0]?.movie_title;

        if(!fetchMovie){
            res.status(404).json({error:'Movie not found'});
            return;
        }

        const fetchImages = await query('SELECT movie_image_location FROM movie_images WHERE movie_id = ?', [id]);

        const images = [];
        for(let image of fetchImages){
            images.push(image.movie_image_location)
        }

        res.json({movie_title: fetchMovie, images: images});
    }
    catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

const addNewMovie = async (req, res)=>{
    let { movie_title, movie_director_name, movie_description, movie_duration, movie_rating } = req.body;

    if (!movie_title || !movie_director_name || !movie_description || !movie_duration) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (movie_rating < 0 || movie_rating > 10) {
        return res.status(400).json({ error: 'Rating should be between 0 and 10' });
    }

    movie_title = movie_title.trim();
    movie_description = movie_description.trim();
    movie_director_name = movie_director_name.trim();

    try {

        const fetchMovie = await query("SELECT * FROM movies WHERE movie_title = ? AND movie_director_name = ?", [movie_title, movie_director_name]);
        if(fetchMovie.length != 0){
            res.status(400).json({error: 'movie with same name and director exists'});
            return;
        }

        // SQL query to insert the movie
        const insertQuery = `
            INSERT INTO movies (movie_title, movie_director_name, movie_description, movie_duration, movie_rating)
            VALUES (?, ?, ?, ?, ?)
        `;

        // Execute the query and pass the values from the request body
        const result = await query(insertQuery, [movie_title, movie_director_name, movie_description, movie_duration, movie_rating]);
        const fetchInsertedMovieQuery = `SELECT * FROM movies WHERE movie_id = ?`;
        const insertedMovie = await query(fetchInsertedMovieQuery, [result.insertId]);

        // Respond with success
        res.status(201).json({ message: 'Movie added successfully',  movie: insertedMovie[0]  });
    } catch (error) {
        console.error('Error inserting movie:', error);
        res.status(500).json({ error: 'Failed to add movie' });
    }
}

const addMovieGenres = async(req,res) => {
    const movie_id = req.params.id;
    const genreIds = req.body.genreIds;
    try{
        if (!Array.isArray(genreIds) || genreIds.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty genreIds array' });
        }

        const validGenresQuery = `
            SELECT movie_genre_id FROM  movie_genres WHERE movie_genre_id IN (?)
        `;
        const validGenres = await query(validGenresQuery, [genreIds]);

        const validIds = validGenres.map(genre => genre.movie_genre_id);

        const invalidGenreIds = genreIds.filter(genreId => !validIds.includes(genreId));

        if (invalidGenreIds.length > 0) {
            console.log('Error: Some genres were not found');
            console.log(invalidGenreIds);
            return res.status(400).json({
                error: "Some genres were not found",
                invalidGenreIds
            });
        }

        const fetchExistingMovieMappings = (await query(`SELECT movie_genre_id FROM movie_genre_mapping WHERE movie_id = ?`,[movie_id]));
        const existingId = fetchExistingMovieMappings.map(genre => genre.movie_genre_id);
        

        const idsToBeInserted = validIds.filter(id => !existingId.includes(id))

        const insertQuery = `INSERT INTO movie_genre_mapping (movie_id, movie_genre_id) VALUES (?,?)`;
        

        for(let genre_id of idsToBeInserted){
            await query(insertQuery,[movie_id, genre_id])
        }
        
        res.status(201).json({
            success: `Genres successfully mapped to movie with ID: ${movie_id}`,
            mappedGenres: validIds,
        })
    }
    catch(e){
        console.log(e);
        res.status(500).json({error:e})
    }
}

const addNewImages = async(req,res)=>{

    const movie_id = req.params.id;

    const image_location = req.body.image_location;

    if(!movie_id || !image_location){
        res.status(400).json({error:"Incomplete or invalid payload"})
        return;
    }

    const insertQuery = `
        INSERT INTO movie_images (movie_id, movie_image_location)
        VALUES (?,?)
    `;

    try{
        const fetchMovie = await query("SELECT movie_id FROM movies WHERE movie_id = ?", [movie_id]);
        if(fetchMovie.length == 0){
            res.status(404).json({error:'movie does not exists'});
            return;
        }

        await query(insertQuery, [movie_id, image_location]);
        res.status(201).json({success:'Image Uploaded Successfully'})
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:JSON.stringify(error)});
    }


}

const getMovieGenres = async(req, res) => {
    try{
        const id = req.params.id;
        
        const fetchMovieGenreMappings = await query("SELECT * FROM movie_genre_mapping JOIN movie_genres ON movie_genre_mapping.movie_genre_id = movie_genres.movie_genre_id WHERE movie_id = ?", [id]);

        const genres = []
        for(let movie of fetchMovieGenreMappings){
            genres.push({genre_id: movie.movie_genre_id, genre:movie.movie_genre_name})
        }

        const response = {genres:genres}
        
        res.status(200).json(response)
    }
    catch(e){
        console.log(e)
        res.status(5000).json({error:e});
    }
}

module.exports = {
    getMovies,
    getMovie,
    getGenres,
    getGenre,
    getMovieGenres,
    getMovieImages,
    addNewMovie,
    addMovieGenres,
    addNewImages
};