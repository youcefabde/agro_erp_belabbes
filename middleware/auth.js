function isAuthenticated(req, res, next) {

    if (req.session.user) {

        next();

    } else {

        res.redirect("/login");

    }

}

function isAdmin(req, res, next) {

    if (req.session.user.role === "admin") {

        next();

    } else {

        res.send("Access Denied");

    }

}

module.exports = {

    isAuthenticated,
    isAdmin

};