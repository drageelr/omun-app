'use strict'

// Dependancies
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Chat Schema
const blockSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    committeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Committee'
    }
}, {
    timestamps: true
});

// Export Schema
module.exports = mongoose.model('Block',blockSchema);