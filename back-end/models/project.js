const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProjectSchema = new mongoose.Schema(
  { 
    createrId: String
  ,
    name: {
        type : String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Must be atleast three characters long'],
        maxlength: [32, 'Think of a shorter name']
    },  
    end_date: {
      type: Date,
      required: false,
      default: null
    },  
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }],
    slug: {
        type : String,
      unique: true,
        lowercase: true,
        index: true
    },
    tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'task'
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);

