'use strict'

// Dependancies
var mongoose = require('mongoose');
var { autoIncrement } = require('mongoose-plugin-autoinc');
const Schema = mongoose.Schema;

// Selection Schema
const selectionSchema = new Schema({
    delegateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delegate'
    },
    selectionId: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Option Schema
const optionSchema = new Schema({
    content: {
        type: String,
        required: true
    }
});

// Vote Schema
const voteSchema = new Schema({
    voteId: {
        type: Number,
        unique: true
    },
    committeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Committee'
    },
    content: {
        type: String,
        required: true
    },
    options: [optionSchema],
    selections: [selectionSchema]
}, {
    timestamps: true
});

// Attach autoIncrement Plugin
voteSchema.plugin(autoIncrement, {model: 'Vote', field: 'voteId', startAt: 1, incrementBy: 1});

// Export Schema
module.exports = mongoose.model('Vote', voteSchema);