/*const express = require("express");

const { getMovies,postMovies,deleteMovies, putMovies } = require("../controllers/movies.controllers");
const moviesRouter = express.Router();

moviesRouter.get("/",getMovies)
moviesRouter.post("/",postMovies)
moviesRouter.post("/",deleteMovies)
moviesRouter.post("/",putMovies)

module.exports = moviesRouter ;


router.get('/', async (req, res, next) => {
    try {
        const characters = await Movie.find();
        return res.status(200).json(characters)
    }
    catch (err) {
        next(err)
    }
})*/

const express = require('express');
const router = express.Router();
const Movie = require('../models/movie.models')
const {isAuthenticated} = require('../middleware/auth.middleware');
const {upload} = require('../middleware/file.middleware');
const imageToUri = require('image-to-uri');
const fs = require("fs");;


router.get('/title/:title', async (req, res, next) => {
    try {
        const title = req.params.title;
        const movies = await Movie.find({title: title});
        //return res.status(200).json(movies[0].title) muestra el parámetro
        return res.status(200).json(movies)
    }
    catch (err) {
        //return res.status(500).json(err)
        next(err)
    }
})

router.get('/id/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const movie = await Movie.findById(id);
        if (movie) {
            return res.status(200).json(movie);
        } else {
            let error = new Error('Película no encontrada');
            error.status = 404;
            throw error;
        }
    }
    catch (err) {
        console.log(err);
        //return res.status(500).send(err.message);
        next(err)
    }
})

router.get('/genre/:genre', async (req, res, next) => {
    try {
        const genre = req.params.genre;
        const movies = await Movie.find({genre: genre});
        //return res.status(200).json(movies[0].genre)
        return res.status(200).json(movies)
    }
    catch (err) {
        //return res.status(500).json(err)
        next(err)
    }
})

router.get('/year/2010', async (req, res, next) => {
    try {
        const year = req.params.year;
        const movies = await Movie.find({year: {$gt: 2010}});
        //return res.status(200).json(movies[0].genre)
        return res.status(200).json(movies)
    }
    catch (err) {
        //return res.status(500).json(err)
        next(err)
    }
})

router.post('/add-new', [isAuthenticated], upload.single('picture'), async (req, res, next) => {
    try {
        const moviePicture = req.file.path ? req.file.path : null; //req.file.path;
        console.log(req.body)
        const newMovie = new Movie({
            title: req.body.title,
            director: req.body.director,
            year: req.body.year,
            genre: req.body.genre,
            picture: imageToUri(moviePicture)
        });
        const createdMovie = await newMovie.save();
        await fs.unlinkSync(moviePicture);

        console.log(newMovie);
        res.status(201).json(createdMovie)
    }
    catch (err) {
        next(err)
    }
})

router.put('/updateById/:id', [isAuthenticated], async(req, res, next) => {
    try {
        const id = req.params.id;
        const movieToModify = new Movie(req.body);
        movieToModify._id = id;
        const movieUpdated = await Movie.findByIdAndUpdate(id, movieToModify);
        if (!movieUpdated) {
            let error = new Error('Película no encontrado');
            error.status = 404;
            throw error;
        } else {
            //res.status(200).json(characterUpdate);//envia version antigua
            res.status(200).json(movieUpdated);//envia version modificada
        }
    } 
    catch (err) {
        next(err)
    }
})

router.delete('/deleteById/:id', [isAuthenticated], async(req, res, next) => {
    try {
        const id = req.params.id;
        const deletedMovie = await Movie.findByIdAndDelete(id);
        console.log(deletedMovie);
        if (deletedMovie) {
            res.status(200).json(deletedMovie);
        } else {
            let error = new Error('Película no encontrado');
            error.status = 404;
            throw error;
        }
    }
    catch (err) {
        next(err)
    }
})

module.exports = router;