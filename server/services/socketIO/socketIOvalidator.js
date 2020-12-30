'use strict'

var { ValidationError } = require('../../errors/errors');
var Schema = require('validate');

const validations = {
    // Chat Management
    'del-chat|DEL-fetch': new Schema({
        delegateId: {
            type: Number,
            required: true
        },
        lastMessageId: {
            type: Number,
            required: true
        }
    }),
    'del-chat-fetch': new Schema({
        delegate1Id: {
            type: Number,
            required: true
        },
        delegate2Id: {
            type: Number,
            required: true
        },
        lastMessageId: {
            type: Number,
            required: true
        }
    }),
    'dias-chat-fetch|DEL': new Schema({
        diasId: {
            type: Number,
            required: true
        },
        lastMessageId: {
            type: Number,
            required: true
        }
    }),
    'dias-chat-fetch|DIAS': new Schema({
        delegateId: {
            type: Number,
            required: true
        },
        lastMessageId: {
            type: Number,
            required: true
        }
    }),
    'del-chat-send': new Schema({
        delegateId: {
            type: Number,
            required: true
        },
        message: {
            type: String,
            required: true,
            length: { min: 1, max: 250 }
        }
    }),
    'del-chat-send': new Schema({
        userId: {
            type: Number,
            required: true
        },
        message: {
            type: String,
            required: true,
            length: { min: 1, max: 250 }
        }
    }),

    // Log & Notification Management
    'log-fetch': new Schema({
        lastLogId: {
            type: Number,
            required: true
        }
    }),
    'notif-fetch': new Schema({
        lastNotifId: {
            type: Number,
            required: true
        }
    }),
    'notif-send': new Schema({
        message: {
            type: String,
            required: true,
            length: { min: 1, max: 250 }
        }
    }),

    // Seat Management
    'seat-sit': new Schema({
        seatId: {
            type: Number,
            required: true,
            size: { min: 1, max: 50 }
        }
    }),
    'seat-unsit': undefined,
    'seat-placard': new Schema({
        placard: {
            type: Boolean,
            required: true
        }
    })
}

exports.validate = (event, obj) => {
    let schema = validations[event];
    if (schema) {
        let errors = schema.validate(obj);
        if (errors.length) {
            return new ValidationError("'REQ|" + event + "': " + errors[0].message);
        }
    }
    return undefined;
}