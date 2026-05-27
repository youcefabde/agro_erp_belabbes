const express = require("express");

const router = express.Router();

const db = require("../db");

const PDFDocument = require("pdfkit");

router.get("/factures", (req, res) => {

    const page = parseInt(req.query.page) || 1;

    const factureSql = `
    SELECT factures.*, clients.nom AS client_nom
    FROM factures
    LEFT JOIN clients
    ON factures.client_id = clients.id
    `;

    const clientSql = "SELECT * FROM clients";

    const produitSql = "SELECT * FROM produits";

    db.query(factureSql, (err, factures) => {

        if (err) {
            return res.send("Database Error");
        }

        db.query(clientSql, (err, clients) => {

            if (err) {
                return res.send("Database Error");
            }

            db.query(produitSql, (err, produits) => {

                if (err) {
                    return res.send("Database Error");
                }

                res.render("factures", {

                    factures,
                    clients,
                    produits,
                    currentPage: page

                });

            });

        });

    });

});

router.post("/add-facture", (req, res) => {

    const {
        client_id,
        produit_id,
        quantite,
        date_facture
    } = req.body;

    const prixSql =
    "SELECT prix, stock FROM produits WHERE id = ?";

    db.query(prixSql, [produit_id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        const prix = result[0].prix;

        const stock = result[0].stock;

        if (quantite > stock) {

            return res.send("Stock insuffisant");

        }

        const montant = prix * quantite;

        const factureSql = `
        INSERT INTO factures
        (client_id, montant, date_facture)
        VALUES (?, ?, ?)
        `;

        db.query(
            factureSql,
            [client_id, montant, date_facture],
            (err, factureResult) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            const facture_id =
            factureResult.insertId;

            const itemSql = `
            INSERT INTO facture_items
            (facture_id, produit_id, quantite)
            VALUES (?, ?, ?)
            `;

            db.query(
                itemSql,
                [facture_id, produit_id, quantite],
                (err) => {

                if (err) {
                    console.log(err);
                    return res.send("Database Error");
                }

                const stockSql = `
                UPDATE produits
                SET stock = stock - ?
                WHERE id = ?
                `;

                db.query(
                    stockSql,
                    [quantite, produit_id],
                    (err) => {

                    if (err) {
                        console.log(err);
                        return res.send("Database Error");
                    }

                    res.redirect("/factures");

                });

            });

        });

    });

});
router.get("/delete-facture/:id", (req, res) => {

    const id = req.params.id;

    const sql =
    "DELETE FROM factures WHERE id = ?";

    db.query(sql, [id], (err) => {

        if (err) {
            return res.send("Delete Error");
        }

        res.redirect("/factures");

    });

});

router.get("/edit-facture/:id", (req, res) => {

    const id = req.params.id;

    const sql =
    "SELECT * FROM factures WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.send("Database Error");
        }

        res.render("edit-facture", {

            facture: result[0]

        });

    });

});

router.get("/invoice/:id/pdf", (req, res) => {

    const id = req.params.id;

    const sql = `
    SELECT factures.*, clients.nom AS client_nom
    FROM factures
    LEFT JOIN clients
    ON factures.client_id = clients.id
    WHERE factures.id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.send("Database Error");
        }

        const facture = result[0];

        const doc = new PDFDocument();

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `inline; filename=facture_${id}.pdf`
        );

        doc.pipe(res);

        doc.fontSize(25)
        .text("Facture", 100, 100);

        doc.fontSize(16)
        .text(
            `Client: ${facture.client_nom}`,
            100,
            160
        );

        doc.text(
            `Montant: ${facture.montant} DA`,
            100,
            190
        );

        doc.text(
            `Date: ${facture.date_facture}`,
            100,
            220
        );

        doc.end();

    });

});
module.exports = router;