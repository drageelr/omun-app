'use strict'

// Dependancies
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SL Schema
const slSchema = new Schema({
    committeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Committee'
    },
    delegateIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delegate'
    }]
}, {
    timestamps: true
});

// Export Schema
module.exports = mongoose.model('SL', slSchema);