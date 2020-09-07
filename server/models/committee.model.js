'use strict'

// Dependancies
var mongoose = require('mongoose');
var { autoIncrement } = require('mongoose-plugin-autoinc');
const Schema = mongoose.Schema;

// Log Schema
const logSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    delegateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delegate'
    }
}, {
    timestamps: true
});

// Committee Schema
const committeeSchema = new Schema({
    committeeId: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    logs: [logSchema],
}, {
    timestamps: true
});

// Attach autoIncrement Plugin
committeeSchema.plugin(autoIncrement, {model: 'Committee', field: 'committeeId', startAt: 1, incrementBy: 1});

// Export Schema
module.exports = mongoose.model('Committee', committeeSchema);