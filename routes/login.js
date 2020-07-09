var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var User = require("../models/user");

// Routes to user login page
router.get("/", (req, res) => {
  if (req.session.email) {
    res.render('boardList')
  }
  else {
    res.render('login')
  }
});

// Authenticating the user
router.post("/user-login", (req, res, next) => {
  try {
    var users = new User();
    var email = req.body.email;
    var password = req.body.password;
    User.find({
      email: email
    }, function (err, userData) {
      if (err) {
        return err;
      } else if (userData.length == 0) {
        res.json({
          message: "User not found"
        });
      } else {
        bcrypt.compare(password, userData[0].password, function (err, result) {
          if (result == true) {
            req.session.email = userData[0].email;
            req.session.username = userData[0].username;
            res.json({
              success: "Login successful"
            });
          } else {
            res.json({
              message: "Login unsuccessful"
            });
            return false;
          }
        });
      }
    });
  } catch (error) {
    res.json({
      message: "an error occured"
    })
  }
});

// Logout from My Planner App
router.get("/logout", (req, res) => {
  if (req.session.userDetails) {
    req.session.destroy();
    req.session = null;
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

module.exports = router;