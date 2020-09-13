'use strict'

const customError = require('../errors/errors');

const routeAccess = {
    // API 1: Account
    "/api/account/add-committee": ["admin"],
    "/api/account/add-dias": ["admin"],
    "/api/account/add-delegates": ["admin"],

    // API 2: Authentication
    "/api/auth/login": false,
    "/api/auth/change-password": ["admin", "dias", "del"],
}

exports.validateAccess = (req, res, next) => {
    try {
        let accessGranted = false;
        let userAccess = routeAccess[req.originalUrl];

        if (userAccess) {
            for (let u of userAccess) {
                if (a === req.body.user.type) {
                    accessGranted = true;
                    break;
                }
            }
        } else {
            accessGranted = true;
        }

        if (!accessGranted) { throw new  customError.ForbiddenAccessError("invalid access rights") }

        next();
    } catch(e) {
        next(e);
    }
}