const express = require("express");
const path = require("path");
const router = express.Router();
const db = require("../db");

router.get("/api/clients", (req, res) => {
    db.query("SELECT * FROM clients", (err, result) => {
        if (err) return res.status(500).json({ error: "Database Error" });
        res.json(result);
    });
});

router.get("/api/produits", (req, res) => {
    db.query("SELECT * FROM produits", (err, result) => {
        if (err) return res.status(500).json({ error: "Database Error" });
        res.json(result);
        });
});

router.get("/api/factures", (req, res) => {
    const sql = `
        SELECT factures.*, clients.nom AS client_nom
        FROM factures
        LEFT JOIN clients
        ON factures.client_id = clients.id
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Database Error" });
        res.json(result);
    });
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Login.html"));
});

module.exports = router;