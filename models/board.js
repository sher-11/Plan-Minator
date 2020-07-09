var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var boardSchema = new Schema({
  boardName: { type: String },
  createdBy: { type: String },
  boardID: { type: Schema.Types.ObjectId, ref: "Board" },
  archived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Board", boardSchema);
