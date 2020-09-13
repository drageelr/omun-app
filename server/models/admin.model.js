'use strict'

// Dependancies
var mongoose = require('mongoose');
var { autoIncrement } = require('mongoose-plugin-autoinc');
const Schema = mongoose.Schema;


// Admin Schema
const adminSchema = new Schema({
    adminId: {
        type: Number,
        unique: true
    },
    email: {
        type: String,
        unqiue: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Attach autoIncrement Plugin
adminSchema.plugin(autoIncrement, {model: 'Admin', field: 'adminId', startAt: 1, incrementBy: 1});

// Export Schema
module.exports = mongoose.model('Admin', adminSchema);