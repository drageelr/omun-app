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
    'dias-chat-send': new Schema({
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
            size: { min: 1, max: 60 }
        }
    }),
    'seat-unsit': undefined,
    'seat-placard': new Schema({
        placard: {
            type: Boolean,
            required: true
        }
    }),

    // Topic & GSL Management
    'topic-create': new Schema({
        delegateId: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true,
            length: { min: 0, max: 250 }
        },
        totalTime: {
            type: Number,
            required: true
        },
        speakerTime: {
            type: Number,
            required: true
        }
    }),
    'topic-edit': new Schema({
        topicId: {
            type: Number,
            required: true
        },
        delegateId: {
            type: Number,
        },
        description: {
            type: String,
            length: { min: 0, max: 250 }
        },
        totalTime: {
            type: Number,
        },
        speakerTime: {
            type: Number,
        },
        visible: {
            type: Boolean
        }
    }),
    'topic-fetch': new Schema({
        lastTopicId: {
            type: Number,
            required: true
        }
    }),
    'topic-speaker-create': new Schema({
        topicId: {
            type: Number,
            required: true
        },
        delegateId: {
            type: Number,
            required: true
        },
    }),
    'topic-speaker-edit': new Schema({
        topicSpeakerId: {
            type: Number,
            required: true
        },
        topicId: {
            type: Number,
            required: true
        },
        delegateId: {
            type: Number
        },
        review: {
            type: String,
            length: { min: 0, max: 500 }
        },
        spokenTime: {
            type: Number
        },
        visible: {
            type: Boolean
        }
    }),
    'topic-speaker-fetch': undefined,
    'gsl-create': new Schema({
        delegateId: {
            type: Number,
            required: true
        }
    }),
    'gsl-edit': new Schema({
        gslId: {
            type: Number,
            required: true
        },
        delegateId: {
            type: Number
        },
        review: {
            type: String,
            length: { min: 0, max: 500 }
        },
        spokenTime: {
            type: Number
        },
        visible: {
            type: Boolean
        },
        timestampSpoken: {
            type: Boolean
        }
    }),
    'gsl-fetch': new Schema({
        lastGSLId: {
            type: Number,
            required: true
        }
    }),

    // Session Management
    'session-edit': new Schema({
        topicId: {
            type: Number
        },
        speakerId: {
            type: Number
        },
        speakerTime: {
            type: Number
        },
        topicTime: {
            type: Number
        },
        type: {
            type: String,
            length: { min: 0, max: 10 }
        }
    }),
    'session-timer': new Schema({
        speakerTimer: {
            type: Boolean,
            required: true
        },
        toggle: {
            type: Number,
            required: true,
            size: { min: 0, max: 2 } // 0->reset 1->pause 2->play
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