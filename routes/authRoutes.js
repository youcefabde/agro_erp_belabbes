const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("../db");

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "Login.html"));
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) return res.send("Database Error");

        if (result.length === 0) {
            return res.send("User not found");
        }

        const user = result[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.send("Wrong Password");
        }

        req.session.user = user;

        if (user.role === "admin") {
            return res.redirect("/admin");
        }

        if (user.role === "moderator") {
            return res.redirect("/moderator");
        }

        return res.redirect("/employee");
    });
});

router.post("/register", async (req, res) => {
    const { email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";

    db.query(sql, [email, hashedPassword, role], (err) => {
    if (err) {
        console.log("REGISTER ERROR:", err);
        return res.send("Registration Error");
    }

    res.redirect("/login");
});
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;