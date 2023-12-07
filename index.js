const express = require('express');
const Movies = require("./src/api/models/movie.models");
const server = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('./src/api/authentication/passport');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
dotenv.config();

const moviesRoutes = require('./src/api/routes/movie.routes')
const cinemaRoutes = require('./src/api/routes/cinema.routes')
const userRoutes = require('./src/api/routes/cinema.routes')

const { connect } = require('./src/api/utils/db')
connect();
const PORT = 3000;

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
      secret: 'upgradehub_node', 
      resave: false, 
      saveUninitialized: false, 
      cookie: {
        maxAge: 3600000 
      },
      store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URL
      })
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/movies', moviesRoutes);
app.use('/cinema', cinemaRoutes);
app.use('/user', userRoutes);

app.use(express.json());
app.use(express.urlencoded({extended:false}));



app.use((err, req, res, next) => {
	return res.status(err.status || 500).json(err.message || "Unexpected error");
});


app.listen(PORT,() => console.log(`escuchando en el puerto : http://localhost:${PORT}`))

