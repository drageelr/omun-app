'use strict'

// Dependancies
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Chit Schema
const chitSchema = new Schema({
    senderId: {
        type: Number,
        required: true
    },
    recieverId: {
        type: Number,
        required: true
    },
    content: {
        type: String
    }
}, {
    timestamps: true
});

// Chat Schema
const chatSchema = new Schema({
    committeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Committee'
    },
    delegateIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delegate'
    }],
    chits: [chitSchema]
}, {
    timestamps: true
});

// Export Schema
module.exports = mongoose.model('Chat', chatSchema);