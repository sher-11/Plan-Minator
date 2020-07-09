var express = require("express");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TeamSchema = new Schema({
  createdBy: { type: String },
  teamName: { type: String },
  members: { type: [String] },
  boardID: { type: Schema.Types.ObjectId, ref: "Board" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Team", TeamSchema);
