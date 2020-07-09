function sessionCheck(req, res, next) {
    return function (req, res, next) {
        if (req.session.email) {
            return next();
        } else {
            res.redirect("/");
        }
    }
}

module.exports = {
    sessionCheck: sessionCheck
};