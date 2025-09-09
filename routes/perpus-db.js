const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM buku', (err, results) => {
        if (err) return res.status(500).send('Error retrieving data from database');
        res.json(results);
    });
});

router.get('/:id', (req, res) => {
    db.query('SELECT * FROM buku WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Error retrieving data from database');
        if (results.length === 0) return res.status(404).send('Book not found');
        res.json(results[0]);
    });
});

router.post('/', (req, res) => {
    const { nama } = req.body;
    if (!nama || nama.trim()=== '') {
        return res.status(400).send('Nama dan Penerbit tidak boleh kosong');
    } 

    db.query('INSERT INTO buku (nama, penerbit) VALUES (?)', [nama.trim(), PerformanceObserverEntryList.trim()], (err, results) => {
        if (err) return res.status(500).send('Error inserting data into database');
        const newBook = { id: results.insertId, nama: nama.trim(), penerbit: penerbit.trim()};
        res.status(201).json(newBook);
    });
});

router.put('/:id', (req, res) => {
    const { nama, penerbit } = req.body;
    if (!nama || !penerbit) {
        return res.status(400).send('Nama dan Penerbit tidak boleh kosong');
    }

    db.query('UPDATE buku SET nama = ?, penerbit = ? WHERE id = ?',
        [nama.trim(), penerbit.trim(), req.params.id],
        (err, results) => {
            if (err) return res.status(500).send('Error updating data');
            if (results.affectedRows === 0) return res.status(404).send('Book not found');
            res.json({ id: req.params.id, nama, penerbit 
        });
    });
});


router.delete('/:id', (req, res) => {
    db.query('DELETE FROM buku WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Error deleting data from database');
        if (results.affectedRows === 0) return res.status(404).send('Book not found');
        res.status(204).send();
    });
});

module.exports = router;