const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const TaskSchema = new mongoose.Schema(
  {   project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'project',
    required: true
  },
    title: {
        type : String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Must be atleast three characters long'],
        maxlength: [32, 'Think of a shorter name'],
        text: true
    },
  
    transition: {
       type: String,
       enum: ['ToDo','InProgress', 'Done'],
       default: 'ToDo'
    },
    assignee: {
     type:[ mongoose.Schema.Types.ObjectId],
      ref: 'user',
     
    },
    labels: {
        type : String,
    },
    sprint: {
        type: String,
        default: null
    },
    description:{
      type: String
    },
    comments: {
      type:[String],
    },
    duedate: { type: Date },
    storyPoints: {
      type: Number,
      default: 0
    },
    imageUrl: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
      },
    ],
    doneDate: {
      type: Date 
    },
    typeOfTask: {
      type: String,
      enum: ['Task','Bug','Story'],
      default: 'Task'
   },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);

