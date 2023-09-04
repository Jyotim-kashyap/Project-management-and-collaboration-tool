const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const codeUpdate = new Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
      },
    requestDate: {
        type: Date,
        required: true,
    },
    developer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,

    },
    changeDetails: {
        type: String,
        required: true
    },
    changePath: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    systemAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
     
    },
    deploymentDate: {
        type: Date,
        required: true,
   
        validate: {
            validator: function(v) {
                return v >= this.requestDate;
            },
            message: 'Deployment date must be after request date'
        }
    }
});

module.exports = mongoose.model('codeUpdate', codeUpdate);
