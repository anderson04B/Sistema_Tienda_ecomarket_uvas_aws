const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecouvas_db'
});

db.connect(err => {
  if (err) throw err;
});

app.get('/api/uvas', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(3000, () => {});