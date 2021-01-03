'use strict'

var { ForbiddenAccessError } = require('../../errors/errors');

const eventAccess = {
    // Chat Management
    'del-chat-fetch|DEL': ["delegate"],
    'del-chat-fetch': ["admin", "dias"],
    'dias-chat-fetch|DEL': ["delegate"],
    'dias-chat-fetch|DIAS': ["dias"],
    'del-chat-send': ["delegate"],
    'dias-chat-send': ["dias", "delegate"],

    // Log & Notification Management
    'log-fetch': ["admin", "dias"],
    'notif-fetch': ["admin", "dias", "delegate"],
    'notif-send': ["dias"],

    // Seat Management
    'seat-sit': ["delegate"],
    'seat-unsit': ["delegate"],
    'seat-placard': ["delegate"],

    // Topic & GSL Management
    'topic-create': ["dias"],
    'topic-edit': ["dias"],
    'topic-fetch': ["admin", "dias", "delegate"],
    'topic-speaker-create': ["dias"],
    'topic-speaker-edit': ["dias"],
    'topic-speaker-fetch': ["admin", "dias", "delegate"],
    'gsl-create': ["dias"],
    'gsl-edit': ["dias"],
    'gsl-fetch': ["admin", "dias", "delegate"],

    // Session Management
    'session-edit': ["dias"],
    'session-timer': ["dias"]
};

exports.validateAccess = (event, type) => {
    try {
        let userAccess = eventAccess[event];

        if (userAccess) {
            for (let u of userAccess) {
                if (u === type) {
                    return undefined;
                }
            }
        }

        throw new ForbiddenAccessError("you are not allowed to emit this event");

    } catch (err) {
        return err;
    }
}