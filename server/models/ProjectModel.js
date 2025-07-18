const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description:{type: String},
  status: { type: String, enum: ["Active", "Completed"], default: "active" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
},{ timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
