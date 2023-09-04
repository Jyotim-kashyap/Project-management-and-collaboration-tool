const mongoose = require('mongoose');
const { Schema } = mongoose;


const roomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  results: {
    type: [],
    default: []
  },
  visibility: {
    type: Boolean,
    default: false
  }
});



module.exports = mongoose.model('Room', roomSchema);
