var express = require("express");
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: { type: String, unique: true },
  password: { type: String },
  username: { type: String },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", UserSchema);
