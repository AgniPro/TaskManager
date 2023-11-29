const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;