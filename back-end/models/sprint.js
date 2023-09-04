const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const SprintSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'project',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Must be at least three characters long'],
    },
    goal: {
      type: String,
      default: "Edit to add a goal to the sprint"
    },
    start_date: {
      type: Date,
      required: false,
      default: null
    },
    end_date: {
      type: Date,
      required: false,
      default: null
    },
    tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'task'
    }],
    slug: {
      type: String,
      lowercase: true,
    },
    sprintcompleted: {
      type: Boolean,
      default: false
    },   
    archived: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sprint", SprintSchema);
