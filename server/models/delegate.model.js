'use strict'

// Dependancies
var mongoose = require('mongoose');
var { autoIncrement } = require('mongoose-plugin-autoinc');
const Schema = mongoose.Schema;


// Delegate Schema
const delegateSchema = new Schema({
    delegateId: {
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
    },
    country: {
        type: String,
        required: true
    },
    committeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Committee',
        required: true
    },
    placard: {
        type: Boolean,
    },
    blockId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Block'
    }
}, {
    timestamps: true
});

// Attach autoIncrement Plugin
delegateSchema.plugin(autoIncrement, {model: 'Delegate', field: 'delegateId', startAt: 1, incrementBy: 1});

// Export Schema
module.exports = mongoose.model('Delegate', delegateSchema);