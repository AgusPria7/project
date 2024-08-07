const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

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

function processTransaction(transaction) {
    return new Promise((resolve, reject) => {
      console.log('Processing transaction for:', transaction);
  
      setTimeout(() => {
        console.log('Transaction processed for:', transaction);
        resolve(transaction);
      }, 30000); // 30 detik
    });
}

app.post('/send', async (req, res) => {
    const transaction = req.body;
    try {
      const processedTransaction = await processTransaction(transaction);
      // Simpan transaksi ke database
      const query = 'INSERT INTO transactions (account_id, amount, type, status) VALUES (?, ?, ?, ?)';
      db.query(query, [transaction.account_id, transaction.amount, 'send', 'processed'], (err, result) => {
        if (err) throw err;
        res.json(processedTransaction);
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
});

app.post('/withdraw', async (req, res) => {
    const transaction = req.body;
    try {
      const processedTransaction = await processTransaction(transaction);
      // Simpan transaksi ke database
      const query = 'INSERT INTO transactions (account_id, amount, type, status) VALUES (?, ?, ?, ?)';
      db.query(query, [transaction.account_id, transaction.amount, 'withdraw', 'processed'], (err, result) => {
        if (err) throw err;
        res.json(processedTransaction);
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
});

app.listen(3001, () => {
  console.log('Payment Manager Service running on port 3001');
});
