const express = require("express");

const router = express.Router();

const path = require("path");

const bcrypt = require("bcrypt");

const db = require("../db");

router.get("/login", (req, res) => {

    res.sendFile(
        path.join(__dirname, "..", "views", "login.html")
    );

});

router.post("/login", (req, res) => {

    const email = req.body.email;

    const password = req.body.password;

    const sql =
    "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        if (result.length === 0) {

            return res.send("User not found");

        }

        const user = result[0];

        const match =
        await bcrypt.compare(password, user.password);

        if (match) {

            req.session.user = user;

            if (user.role === "admin") {

                res.redirect("/admin");

            }
            else if (user.role === "moderator") {

                res.redirect("/moderator");

            }
            else {

                res.redirect("/employee");

            }

        } else {

            res.send("Wrong Password");

        }

    });

});

router.post("/register", async (req, res) => {

    const email = req.body.email;

    const password = req.body.password;

    const role = req.body.role;

    const hashedPassword =
    await bcrypt.hash(password, 10);

    const sql =
    "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";

    db.query(
        sql,
        [email, hashedPassword, role],
        (err) => {

        if (err) {

            console.log(err);

            return res.send("Register Error");

        }

        res.send("Account Created Successfully");

    });

});

router.get("/logout", (req, res) => {

    req.session.destroy();

    res.redirect("/login");

});

module.exports = router;