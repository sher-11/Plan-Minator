var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var listSchema = new Schema({
  listName: { type: String },
  boardID: { type: Schema.Types.ObjectId, ref: "Board" },
  createdBy: { type: String },
  archived: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("List", listSchema);
