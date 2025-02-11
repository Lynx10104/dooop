const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory

// Dummy user data (replace with database in production)
const users = {};

// Register route (for creating users)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = hashedPassword; // Store hashed password
    res.send('User  registered!');
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userPassword = users[username];
    if (userPassword && await bcrypt.compare(password, userPassword)) {
        req.session.user = username; // Store user in session
        res.send('Login successful!');
    } else {
        res.send('Invalid username or password.');
    }
});

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login'); // Redirect to login if not authenticated
}

// Protected route example
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send(`Welcome to your dashboard, ${req.session.user}!`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
