var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var taskSchema = new Schema({
  taskName: { type: String },
  description: { type: String },
  createdBy: { type: String },
  assignedTo: { type: String },
  status: { type: String },
  completionDate: { type: String },
  taskHistory: { type: [String] },
  listID: { type: Schema.Types.ObjectId, ref: "List" },
  archived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
