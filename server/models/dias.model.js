'use strict'

// Dependancies
var mongoose = require('mongoose');
var { autoIncrement } = require('mongoose-plugin-autoinc');
const Schema = mongoose.Schema;


// Dias Schema
const diasSchema = new Schema({
    diasId: {
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
diasSchema.plugin(autoIncrement, {model: 'Dias', field: 'diasId', startAt: 1, incrementBy: 1});

// Export Schema
module.exports = mongoose.model('Dias', diasSchema);