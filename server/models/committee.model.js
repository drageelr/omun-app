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
    }
}, {
    timestamps: true
});

// Notification Schema
const notificationScehma = new Schema({
    content: {
        type: String,
        required: true
    },
    diasId: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Seat Schema
const seatSchema = new Schema({
    seatId: {
        type: Number,
        required: true
    },
    blocked: {
        type: Boolean,
        required: true
    },
    delegateId: {
        type: Number,
        required: true,
    }
});

// Committee Schema
const committeeSchema = new Schema({
    committeeId: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        unique: true
    },
    sessionStatus: {
        type: Boolean,
        required: true
    },
    logs: [logSchema],
    notifications: [notificationScehma],
    seats: [seatSchema]
}, {
    timestamps: true
});

// Attach autoIncrement Plugin
committeeSchema.plugin(autoIncrement, {model: 'Committee', field: 'committeeId', startAt: 1, incrementBy: 1});

// Export Schema
module.exports = mongoose.model('Committee', committeeSchema);