const express = require("express");

const router = express.Router();

const db = require("../db");

router.get("/clients", (req, res) => {

    const sql = "SELECT * FROM clients";

    db.query(sql, (err, result) => {

        if (err) {
            return res.send("Database Error");
        }

        res.render("clients", {

            clients: result

        });

    });

});

router.post("/add-client", (req, res) => {

    const nom = req.body.nom;

    const telephone = req.body.telephone;

    const adresse = req.body.adresse;

    const sql =
    "INSERT INTO clients (nom, telephone, adresse) VALUES (?, ?, ?)";

    db.query(
        sql,
        [nom, telephone, adresse],
        (err) => {

        if (err) {
            return res.send("Database Error");
        }

        res.redirect("/clients");

    });

});

module.exports = router;