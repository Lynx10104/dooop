// server.js (Node.js with Express)
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));

// Dummy user data (replace with database in production)
const users = {
    user1: 'password1',
    user2: 'password2'
};

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        req.session.user = username; // Store user in session
        res.send('Login successful!');
    } else {
        res.send('Invalid username or password.');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
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