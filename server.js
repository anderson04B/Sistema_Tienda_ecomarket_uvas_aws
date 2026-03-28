const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'ecomarket-db.c5qyc8qqc536.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'barraganGG',
  database: 'ecouvas_db'
});

db.connect(err => {
  if (err) throw err;
});

// 1. RUTAS DE LA API (Datos)
app.get('/api/uvas', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// 2. SERVIR LA APLICACIÓN WEB ANGULAR (Producción)
const ngAppPath = path.join(__dirname, 'ecouvas/dist/ecouvas/browser');
app.use(express.static(ngAppPath));

// 3. ENRUTADOR FALLBACK (Permite recargar pestañas sin romper la SPA de Angular)
app.get('*', (req, res) => {
  res.sendFile(path.join(ngAppPath, 'index.html'));
});

// 4. INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor en producción corriendo en: http://localhost:${PORT}`);
});