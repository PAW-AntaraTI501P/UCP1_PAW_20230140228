require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const db=require('./database/db.js');

const bukuRoutes = require('./routes/perpus-db.js');
const port = process.env.PORT || 3002;
const methodOverride = require('method-override');

const expressLayout = require('express-ejs-layouts');
app.use(expressLayout);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/main-layout',
        title: 'Home'
    });
});

app.get('/buku-data', (req, res) => {
    db.query('SELECT * FROM buku', (err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving data from database');
        }
        res.json(results);
    });
});

app.get("/buku-list", (req, res) => {
  db.query("SELECT * FROM buku", (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.render("buku-page", {
      books: results,
      layout: "layouts/main-layout",
    });
  });
});

app.post("/buku-list/add", (req, res) => {
  const { nama, penerbit } = req.body;
  if (!nama || nama.trim() === "") {
    return res.status(400).send("Nama buku tidak boleh kosong");
  }

  db.query(
    "INSERT INTO buku (nama, penerbit) VALUES (?, ?)",
    [nama.trim(), penerbit || ""],
    (err) => {
      if (err) return res.status(500).send("Internal Server Error");
      res.redirect("/buku-list");
    }
  );
});

app.put("/buku-list/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nama, penerbit } = req.body;

  if (!nama || nama.trim() === "") {
    return res.status(400).send("Nama buku tidak boleh kosong");
  }

  db.query(
    "UPDATE buku SET nama = ?, penerbit = ? WHERE id = ?",
    [nama.trim(), penerbit || "", id],
    (err, results) => {
      if (err) return res.status(500).send("Internal Server Error");
      if (results.affectedRows === 0)
        return res.status(404).send("Buku tidak ditemukan");
      res.redirect("/buku-list");
    }
  );
});

app.delete("/buku-list/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);

  db.query("DELETE FROM buku WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).send("Internal Server Error");
    if (results.affectedRows === 0)
      return res.status(404).send("Buku tidak ditemukan");
    res.redirect("/buku-list");
  });
});

app.use("/api/buku", bukuRoutes);

app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});