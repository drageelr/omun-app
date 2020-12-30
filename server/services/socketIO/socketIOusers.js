'use strict'

/**
 * '/committeeId': { 'type': {id: 'socketId'} }
 * "committeeId" is an integer which denotes namespace
 * "type" is a string which denotes "admin", "dias" or "delegate"
 * "id" is an integer represents user's id in DB
 * "socketId" is a string that represents the unique id of the user in the connected namespace
 */
const namespaceUsers = {};

exports.fetchSocketId = (nspName, userType, userId) => {
    if (namespaceUsers[nspName]) {
        if (namespaceUsers[nspName][userType]) {
            return namespaceUsers[nspName][userType][userId];
        }
    }
    return undefined;
}

module.exports.namespaceUsers = namespaceUsers;