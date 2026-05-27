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
// Add Client Page
router.get("/add", (req, res) => {

    res.render("add-client");

});
router.post("/add", (req, res) => {

    const { nom, telephone, adresse } = req.body;

    const sql = `
        INSERT INTO clients (nom, telephone, adresse)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [nom, telephone, adresse], (err) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        res.redirect("/clients");

    });

});
router.get("/edit/:id", (req, res) => {

    const sql = "SELECT * FROM clients WHERE id = ?";

    db.query(sql, [req.params.id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        res.render("edit-client", {
            client: result[0]
        });

    });

});
router.post("/edit/:id", (req, res) => {

    const { nom, telephone, adresse } = req.body;

    const sql = `
        UPDATE clients
        SET nom=?, telephone=?, adresse=?
        WHERE id=?
    `;

    db.query(
        sql,
        [nom, telephone, adresse, req.params.id],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            res.redirect("/clients");

        }
    );

});
router.get("/delete/:id", (req, res) => {

    const sql = "DELETE FROM clients WHERE id = ?";

    db.query(sql, [req.params.id], (err) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        res.redirect("/clients");

    });

});
module.exports = router;
