const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3001;
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elibrary'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as ID', connection.threadId);
});

app.get('/books/data', (req, res) => {
    connection.query('SELECT * FROM books', (err, results) => {
        if (err) {
            res.status(500).send('Database query failed');
            return;
        }
        res.json(results);
    });
});

app.get('/books/:id', (req, res) => {
    const bookId = req.params.id;
    connection.query('SELECT * FROM books WHERE id = ?', [bookId], (err, results) => {
        if (err) {
            res.status(500).send('Database query failed');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Book not found');
            return;
        }

        res.json(results[0]);
    });
});

app.post('/favorites', (req, res) => {
    const { userId, book } = req.body;

    if (!userId || !book) {
        return res.status(400).send('User ID and book details are required');
    }

    const query = `
        INSERT INTO favorites (user_id, book_id, title, author, description, link) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    connection.query(query, [
        userId,
        book.id,
        book.title,
        book.author || 'Unknown',
        book.description || 'No description available.',
        book.link,
    ], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding favorite');
        }
        res.status(200).send('Book added to favorites');
    });
});

app.get('/favorites/:userId', (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    const query = 'SELECT * FROM favorites WHERE user_id = ?';
    connection.query(query, [parseInt(userId)], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching favorites');
        }
        res.status(200).json(results);
    });
});

app.post('/register', async (req, res) => {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
        return res.status(400).send('All fields are required!');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)';
        connection.query(query, [name, surname, email, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing to database');
            }
            res.status(200).send('User registered successfully!');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('An unexpected error occurred');
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required!');
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const user = results[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Invalid email or password');
        }

        res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email }, success: true });
    });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
