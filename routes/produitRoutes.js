const express = require("express");

const router = express.Router();

const db = require("../db");

router.get("/produits", (req, res) => {

    const sql = "SELECT * FROM produits";

    db.query(sql, (err, produits) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        res.render("produits", {

            produits

        });

    });

});

router.post("/add-produit", (req, res) => {

    const { nom, prix, stock } = req.body;

    const sql = `
    INSERT INTO produits
    (nom, prix, stock)
    VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [nom, prix, stock],
        (err) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        res.redirect("/produits");

    });

});

module.exports = router;