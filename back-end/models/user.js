const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: {
      default: "User",
      type: "String"
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true, //allows us to more efficiently search the databse
    },
    role: {
      type: String,
      default: "admin",
    },
    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'project'
    }], 
    task: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'task'
    }], 
  },

  { timestamps: true }

);

module.exports = mongoose.model("User", userSchema);

