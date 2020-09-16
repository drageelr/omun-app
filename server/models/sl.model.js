'use strict'

// Dependancies
var mongoose = require('mongoose');
var { autoIncrement } = require('mongoose-plugin-autoinc');
const Schema = mongoose.Schema;

// SL Schema
const slSchema = new Schema({
    slId: {
        type: Number,
        required: true
    },
    committeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Committee'
    },
    name: {
        type: String,
        required: true
    },
    delegateIds: [{
        type: Number,
        required: true
    }]
}, {
    timestamps: true
});

// Attach autoIncrement Plugin
slSchema.plugin(autoIncrement, {model: 'SL', field: 'slId', startAt: 1, incrementBy: 1});

// Export Schema
module.exports = mongoose.model('SL', slSchema);