const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const { users, categories, movies, favoriteMovies } = require('./db.js');

const app = express();
const secterKey = "Frontend-final-Project";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/categories', (req, res) => { res.json(categories); });
app.get('/users', (req, res) => { res.json(users); });
app.get('/movies', (req, res) => { res.json(movies); });


app.post('/register', (req, res) => {
    const { email, password, username } = req.body;

    if (!username) {
        return res.status(400).json({ message: "Enter your username!" });
    }
    if (!email) {
        return res.status(400).json({ message: "Enter your email!" });
    }
    if (!password) {
        return res.status(400).json({ message: "Enter your password!" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long!" });
    }

    const foundEmail = users.find(user => user.email === email);
    if (foundEmail) {
        return res.status(409).json({ message: "A user with this email address is already registered!" });
    }


    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        email,
        password,
        username,
        role: 'user'
    };
    users.push(newUser);

    return res.status(201).json({ message: `User ${username} has been registered`, user: newUser });
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Enter your email!" });
    }
    if (!password) {
        return res.status(400).json({ message: "Enter your password!" });
    }

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        const token = jwt.sign({ userId: user.id, role: user.role }, secterKey, { expiresIn: 60 * 10 });
        res.json({
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            token: token
        });
    } else {
        res.status(401).json({ message: 'Wrong email or password' });
    }
});

const checkToken = async (req, res, next) => {
    const authValue = req.headers["authorization"];
    const token = authValue && authValue.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "Token not found " });
        return;
    }

    jwt.verify(token, secterKey, (err, value) => {
        if (err) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        else {
            req.userId = value.userId;
            req.userRole = value.role;
            next();
        }
    });
};


app.get('/privateMovies', checkToken, (req, res) => {
    const userId = req.userId;
    const moviesToSend = movies.filter(p => p.userId == userId);
    res.json(moviesToSend);
});

app.post('/movies/create', checkToken, upload.single('photo'), (req, res) => {
    const userId = req.userId;
    const { title, price, content, categoryId } = req.body;
    const photo = req.file ? req.file.path : null;
    movies.push({ id: movies[movies.length - 1].id + 1, title, price, content, userId, categoryId, photo });
    res.json({ message: `Movie ${title} was created...` });
});


app.get('/movies/:movieId', (req, res) => {
    const movieId = req.params.movieId;
    const foundMovie = movies.find(p => p.id == movieId);
    if (foundMovie) {
        res.json(foundMovie);
        return;
    }
    else {
        res.status(404).json({ error: `Movie with id = ${movieId} not found` });
    }
});

app.delete('/movies/delete/:movieId', checkToken, (req, res) => {
    const userId = req.userId;
    const movieId = req.params.movieId;

    const movieIndex = movies.findIndex(p => p.id == movieId);

    if (movieIndex != -1) {
        if (movies[movieIndex].userId != userId && req.userRole !== 'admin') {
            res.status(403).json({ error: `You can not delete this movie` });
            return;
        }
        const movieTitle = movies[movieIndex].title;
        movies.splice(movieIndex, 1);
        res.json({ message: `movie ${movieTitle} was removed` });
        return;
    }
    else {
        res.status(404).json({ error: `movie with id = ${movieId} not found` });
    }
});

app.put('/movies/:movieId/edit', checkToken, upload.single('photo'), (req, res) => {
    const userId = req.userId;
    const movieId = req.params.movieId;
    const { title, price, content, categoryId } = req.body;
    const photo = req.file ? req.file.path : null;

    const movieIndex = movies.findIndex(p => p.id == movieId);
    if (movieIndex != -1) {
        if (movies[movieIndex].userId != userId && req.userRole !== 'admin') {
            res.status(403).json({ error: `You can not update this movies` });
            return;
        }
        movies[movieIndex] = { ...movies[movieIndex], title, price, content, categoryId, photo: photo ? photo : movies[movieIndex].photo };
        res.json({ message: `movie ${title} was edited` });
    }
    else {
        res.status(404).json({ error: `movie not found` });
    }
});

app.get('/movies/category/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    const moviesToSend = movies.filter(p => p.categoryId == categoryId);
    res.json(moviesToSend);
});



app.post('/categories/create', checkToken, (req, res) => {
    const { name } = req.body;
    categories.push({ id: categories[categories.length - 1].id + 1, name });
    res.json({ message: `Category ${name} was created...` });
});

app.delete('/categories/delete/:categoryId', checkToken, (req, res) => {
    const categoryId = req.params.categoryId;
    const categoryIndex = categories.findIndex(c => c.id == categoryId);

    if (categoryIndex != -1) {
        const categoryName = categories[categoryIndex].name;
        categories.splice(categoryIndex, 1);
        res.json({ message: `Category ${categoryName} was removed` });
    } else {
        res.status(404).json({ error: `Category with id = ${categoryId} not found` });
    }
});

app.get('/categories/:categoryId', checkToken, (req, res) => {
    const categoryId = req.params.categoryId;
    const foundCategory = categories.find(c => c.id == categoryId);
    if (foundCategory) {
        res.json(foundCategory);
    } else {
        res.status(404).json({ error: `Category with id = ${categoryId} not found` });
    }
});

app.put('/categories/:categoryId/edit', checkToken, (req, res) => {
    const categoryId = req.params.categoryId;
    const { name } = req.body;

    const categoryIndex = categories.findIndex(c => c.id == categoryId);
    if (categoryIndex != -1) {
        categories[categoryIndex].name = name;
        res.json({ message: `Category ${name} was edited` });
    } else {
        res.status(404).json({ error: `Category not found` });
    }
});



// Admin
app.get('/admin/users', checkToken, (req, res) => {
    if (req.userRole === 'admin') {
        res.json(users);
    } else {
        res.status(403).json({ error: "Forbidden" });
    }
});

app.put('/admin/users/:userId/edit', checkToken, (req, res) => {
    if (req.userRole === 'admin') {
        const userId = req.params.userId;
        const { email, password, username, role } = req.body;

        const userIndex = users.findIndex(u => u.id == userId);
        if (userIndex != -1) {
            users[userIndex] = { ...users[userIndex], email, password, username, role };
            res.json({ message: `User ${username} was edited` });
        } else {
            res.status(404).json({ error: `User not found` });
        }
    } else {
        res.status(403).json({ error: "Forbidden" });
    }
});


app.delete('/admin/users/:userId/delete', checkToken, (req, res) => {
    if (req.userRole === 'admin') {
        const userId = req.params.userId;

        const userIndex = users.findIndex(u => u.id == userId);
        if (userIndex != -1) {
            const username = users[userIndex].username;
            users.splice(userIndex, 1);
            res.json({ message: `User ${username} was removed` });
        } else {
            res.status(404).json({ error: `User not found` });
        }
    } else {
        res.status(403).json({ error: "Forbidden" });
    }
});


app.get('/admin/users/:userId', checkToken, (req, res) => {
    if (req.userRole === 'admin') {
        const userId = req.params.userId;
        const user = users.find(u => u.id == userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: `User with id = ${userId} not found` });
        }
    } else {
        res.status(403).json({ error: "Forbidden" });
    }
});


// many-to-many 
app.get('/favoriteMovies', checkToken, (req, res) => {
    if (req.userRole !== 'user') {
        return res.status(403).json({ error: "Forbidden: Only users with the role 'user' can access favorite movies" });
    }
    
    const userId = req.userId;
    const userFavoriteMovies = favoriteMovies.filter(fav => fav.userId == userId).map(fav => fav.movieId);
    const moviesToSend = movies.filter(movie => userFavoriteMovies.includes(movie.id));
    res.json(moviesToSend);
});

app.post('/favoriteMovies', checkToken, (req, res) => {
    if (req.userRole !== 'user') {
        return res.status(403).json({ error: "Forbidden: Only users with the role 'user' can add favorite movies" });
    }

    const userId = req.userId;
    const { movieId } = req.body;

    if (favoriteMovies.find(fav => fav.userId == userId && fav.movieId == movieId)) {
        return res.status(400).json({ message: "Movie is already in favorites" });
    }

    favoriteMovies.push({ userId, movieId });
    res.json({ message: "Movie added to favorites" });
});

app.delete('/favoriteMovies/:movieId', checkToken, (req, res) => {
    if (req.userRole !== 'user') {
        return res.status(403).json({ error: "Forbidden: Only users with the role 'user' can remove favorite movies" });
    }

    const userId = req.userId;
    const movieId = req.params.movieId;

    const favoriteIndex = favoriteMovies.findIndex(fav => fav.userId == userId && fav.movieId == movieId);

    if (favoriteIndex !== -1) {
        favoriteMovies.splice(favoriteIndex, 1);
        res.json({ message: "Movie removed from favorites" });
    } else {
        res.status(404).json({ error: "Movie not found in favorites" });
    }
});


app.listen(3005,()=>{
    console.log("Server started...")
});