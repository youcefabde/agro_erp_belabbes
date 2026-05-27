const express = require("express");
const path = require("path");
const db = require("./db");
const app = express();
const bcrypt = require("bcrypt");

const session = require("express-session");
const apiRoutes =
require("./routes/apiRoutes");
app.use("/", apiRoutes);


const {
    isAuthenticated,
    isAdmin
} = require("./middleware/auth");
const clientRoutes =
require("./routes/clientRoutes");

const produitRoutes =
require("./routes/produitRoutes");

const factureRoutes =
require("./routes/factureRoutes");

const authRoutes =
require("./routes/authRoutes");


function isModerator(req, res, next) {

    if (req.session.user.role === "moderator") {

        next();

    } else {

        res.send("Access Denied");

    }

}
function isEmployee(req, res, next) {

    if (req.session.user.role === "employee") {

        next();

    } else {

        res.send("Access Denied");

    }

}

app.use(express.urlencoded({ extended: true }));
app.use(session({

    secret: "secretkey",

    resave: false,

    saveUninitialized: false

}));
app.use(express.static("public"));
app.use("/", authRoutes);
app.use("/", clientRoutes);
app.use("/", produitRoutes);
app.use("/", factureRoutes);




app.set("view engine", "ejs");


app.get("/admin", isAuthenticated, isAdmin, (req, res) => {

    const clientsSql =
    "SELECT COUNT(*) AS totalClients FROM clients";

    const produitsSql =
    "SELECT COUNT(*) AS totalProduits FROM produits";

    const facturesSql =
    "SELECT COUNT(*) AS totalFactures FROM factures";

    const revenueSql =
    "SELECT SUM(montant) AS totalRevenue FROM factures";

    db.query(clientsSql, (err, clientsResult) => {

        if (err) {
            return res.send("Database Error");
        }

        db.query(produitsSql, (err, produitsResult) => {

            if (err) {
                return res.send("Database Error");
            }

            db.query(facturesSql, (err, facturesResult) => {

                if (err) {
                    return res.send("Database Error");
                }

                db.query(revenueSql, (err, revenueResult) => {

                    if (err) {
                        return res.send("Database Error");
                    }

                    res.render("admin", {

                        totalClients:
                        clientsResult[0].totalClients,

                        totalProduits:
                        produitsResult[0].totalProduits,

                        totalFactures:
                        facturesResult[0].totalFactures,

                        totalRevenue:
                        revenueResult[0].totalRevenue || 0

                    });

                });

            });

        });

    });

});


app.get("/moderator",isAuthenticated,isModerator,(req, res) => {

    res.sendFile(
        path.join(__dirname,
        "views",
        "moderator.html")
    );

});
app.get("/employee",isAuthenticated,isEmployee,(req, res) => {

    res.sendFile(
        path.join(__dirname,
        "views",
        "employee.html")
    );

});

app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});







app.listen(3000, () => {
    console.log("Server running on port 3000");
});