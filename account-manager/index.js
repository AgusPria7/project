const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

// Middleware untuk verifikasi token JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Endpoint untuk registrasi pengguna
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(query, [username, hashedPassword], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send('User registered');
  });
});

// Endpoint untuk login pengguna
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('User not found');

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).send('Invalid password');

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ accessToken });
  });
});

// Endpoint untuk mendapatkan akun pengguna
app.get('/accounts', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM accounts WHERE user_id = ?';
  db.query(query, [req.user.userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Endpoint untuk mendapatkan riwayat pembayaran
app.get('/transactions', authenticateToken, (req, res) => {
  const query = `
    SELECT transactions.* FROM transactions
    JOIN accounts ON transactions.account_id = accounts.id
    WHERE accounts.user_id = ?`;
  db.query(query, [req.user.userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Account Manager Service running on port 3000');
});
