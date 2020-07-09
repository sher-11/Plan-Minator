var express = require('express')
var router = express.Router();
var User = require('../models/user')


router.get('/', (req, res) => {
	res.render('signup')
})

router.post('/user-details', (req, res, next) => {
	try {
		var password = req.body.password;
		var confirmPassword = req.body.confirmPassword;
		if (password === confirmPassword) {

			var user = new User();
			user.username = req.body.username;
			user.email = req.body.email;
			user.password = req.body.password;
			User.findOne({
				email: req.body.email
			}, function (err, existingUser) {

				if (existingUser) {
					res.json({
						'message': 'Account with the same address already exists'
					});
				} else {
					user.save(function (err, user) {
						if (err) return next(err);
						res.send(user)
					});
				}
			});
		} else {
			res.json({
				"message": "Entered password does not Match"
			})
		}
	} catch (error) {
		res.json({ message: "Error occured" })
	}
})

module.exports = router;