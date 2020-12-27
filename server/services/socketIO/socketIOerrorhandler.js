'use strict'

var customError = require('../errors/errors');

function errorHandler(socket, err) {
    if (err instanceof customError.AuthenticationError ||
        err instanceof customError.DuplicateResourceError ||
        err instanceof customError.ForbiddenAccessError ||
        err instanceof customError.NotFoundError ||
        err instanceof customError.ValidationError) {
        console.log(err);
        socket.emit('err', {
            name: err.name,
            message: err.message,
            details: err.details
        });
    } else {
        console.log(err);
        socket.emit('err', {
            name: "InternalServerError",
            message: "Internal Server Error!",
            details: "something went wrong on the server"
        });
    }
}

module.exports.errorHandler = errorHandler;