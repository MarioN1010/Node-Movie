/*const express = require("express");

const Cinema = require("../models/cinema.models");

const { getCinema,postCinema,deleteCinema } = require("../controllers/cinema.controllers");
const CinemaRouter = express.Router();

module.exports = CinemaRouter;*/

const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middleware/auth.middleware');
const Cinema = require('../models/cinema.models');
const {upload} = require('../middleware/file.middleware');
const imageToUri = require('image-to-uri');
const fs = require("fs");

router.get('/', async (req, res, next) => {
	try {
		const cinema = await Cinema.find().populate('movies');
		return res.status(200).json(cinema)
	} catch (err) {
		return next(err)
	}
});

router.post('/', [isAuthenticated], upload.single('picture'), async (req, res, next) => {
    try{
        const cinemaPicture = req.file.path ? req.file.path : null; //req.file.path
        const newCinema = new Cinema({
            name: req.body.name,
            location: req.body.location,
            movies: [],
            picture: imageToUri(cinemaPicture)
        });

        const createdCinema = await newCinema.save();
        await fs.unlinkSync(cinemaPicture);
        return res.status(201).json(createdCinema);
    }
    catch(err){
        return next(err)
    }
});

router.delete('/deleteById/:id',[isAuthenticated], async (req, res, next) => {
    try{
        const id = req.params.id;
        const cinemaDeleted = await Cinema.findByIdAndDelete(id);
        return res.status(200).json(cinemaDeleted);
    }
    catch(err){
        return next(err)
    }
});

router.put('/updateById/:id', [isAuthenticated], async(req, res, next) => {
    try {
        const id = req.params.id;
        const cinemaToModify = new Cinema(req.body);
        cinemaToModify._id = id;
        const cinemaUpdated = await Cinema.findByIdAndUpdate(id, cinemaToModify);
        if (!cinemaUpdated) {
            let error = new Error('Cine no encontrado');
            error.status = 404;
            throw error;
        } else {
            
            res.status(200).json(cinemaUpdated);
        }
    } 
    catch (err) {
        next(err)
    }
})

router.put('/add-movie', [isAuthenticated], async (req, res, next) => {
    try {
        const cinemaId = req.body.cinemaId; 
        const movieId = req.body.movieId;
        const updatedCinema = await Cinema.findByIdAndUpdate(cinemaId, {
            $push: { movies: movieId } 
        });
        if (!updatedCinema) {
            return res.status(404).json({ error: 'Cinema no encontrado' });
        }
        return res.status(200).json(updatedCinema);
    } 
    catch (err) {
        return next(err);
    }
});

router.put('/add-movie-by-genre', [isAuthenticated], async (req, res, next) => {
    try {
        const cinemaId = req.body.cinemaId; 
        const genre = req.body.genre;
        const moviesToAdd = await movieId.find({genre: genre});
        const updatedCinema = await Cinema.findByIdAndUpdate(cinemaId, {
            $addToSet: { movies: { $each: moviesToAdd}},
           
        })
        return res.status(200).json(updatedCinema);
    } 
    catch (err) {
        return next(err);
    }
});

router.put('/add-movie-array', [isAuthenticated], async (req, res, next) => {
    try {
        const cinemaId = req.body.cinemaId; 
        const movieIdArray = req.body.movieIdArray;
        const updatedCinema = await Cinema.findByIdAndUpdate(cinemaId, {
            $addToSet: { movies: { $each: movieIdArray } }
        });
        if (!updatedCinema) {
            return res.status(404).json({ error: 'Cinema no encontrado' });
        }
        return res.status(200).json(updatedCinema);
    } 
    catch (err) {
        return next(err);
    }
});



router.delete('/delete-movie-array/:id', [isAuthenticated], async (req, res, next) => {
    try {
        const cinemaId = req.body.cinemaId; 
        const movieIdArray = req.body.movieIdArray;
        const updatedCinema = await Cinema.findByIdAndDelete(cinemaId, {
            $pull: { movies: { $each: movieIdArray } }
        });
        if (!updatedCinema) {
            return res.status(404).json({ error: 'Cinema no encontrado' });
        }
        return res.status(200).json(updatedCinema);
    } 
    catch (err) {
        return next(err);
    }
});

module.exports = router;