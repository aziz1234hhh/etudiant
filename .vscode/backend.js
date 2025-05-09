const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Importer CORS

const app = express();

// Utiliser CORS pour permettre les requêtes croisées
app.use(cors());

app.use(express.json());
const multer = require('multer');
const path = require('path');

// Configuration de Multer pour stocker les images dans le dossier 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom unique pour chaque fichier
  }
});

const upload = multer({ storage: storage });

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '', // Replace with your MySQL password
  database: 'etudiants'
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Failed to connect to MySQL', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Routes
// Récupérer tous les étudiants
app.get('/api/etudiants', (req, res) => {
  connection.query('SELECT * FROM etudiants', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Ajouter un étudiant
app.post('/api/etudiants', (req, res) => {
  const { nom, prenom, email, telephone, classe, niveau, cin } = req.body;
  
  connection.query(
    'INSERT INTO etudiants (nom, prenom, email, telephone, classe, niveau, cin) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nom, prenom, email, telephone, classe, niveau, cin],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: results.insertId, ...req.body });
      }
    }
  );
});
app.put('/api/etudiants/:id', (req, res) => {
  const { nom, prenom, classe, niveau, cin, email, date_naissance, telephone } = req.body;
  const sql = `
    UPDATE etudiants 
    SET nom = ?, prenom = ?, classe = ?, niveau = ?, cin = ? = ?, email = ?, date_naissance = ?, telephone = ?
    WHERE id = ?
  `;
  const values = [nom, prenom, classe, niveau, cin, email, date_naissance, telephone, req.params.id];

  connection.query(sql, values, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: req.params.id, ...req.body });
    }
  });
});

// Supprimer un étudiant
app.delete('/api/etudiants/:id', (req, res) => {
  connection.query('DELETE FROM etudiants WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(204).send();
    }
  });
});




const PORT = 3007;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
  
