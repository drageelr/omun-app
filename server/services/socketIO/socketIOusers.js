'use strict'

/**
 * '/committeeId': { 'type': {id: 'socketId'} }
 * "committeeId" is an integer which denotes namespace
 * "type" is a string which denotes "admin", "dias" or "delegate"
 * "id" is an integer represents user's id in DB
 * "socketId" is a string that represents the unique id of the user in the connected namespace
 */
let namespaceUsers = {};

let namespaceFuncAttached = {};

exports.attachFunc = (nspName) => {
    if (namespaceFuncAttached[nspName] === undefined) {
        namespaceFuncAttached[nspName] = true;
        return true;
    }

    return false;
}

exports.fetchSocketId = (nspName, userType, userId) => {
    if (namespaceUsers[nspName]) {
        if (namespaceUsers[nspName][userType]) {
            return namespaceUsers[nspName][userType][userId];
        }
    }
    return undefined;
}

exports.addUser = (nspName, userType, userId, socketId) => {
    if (namespaceUsers[nspName] === undefined) {
        namespaceUsers[nspName] = {};
    }

    if (namespaceUsers[nspName][userType] === undefined) {
        namespaceUsers[nspName][userType] = {};
    }

    if (namespaceUsers[nspName][userType][userId] === undefined) {
        namespaceUsers[nspName][userType][userId] = socketId;
        return true;
    }
    
    return false;
}

exports.deleteUser = (nspName, userType, userId) => {
    if (namespaceUsers[nspName] === undefined) {
        return false;
    }

    if (namespaceUsers[nspName][userType] === undefined) {
        return false;
    }

    if (namespaceUsers[nspName][userType][userId] === undefined) {
        return false;
    }

    delete namespaceUsers[nspName][userType][userId];
    return true;
}

exports.fetchUsers = (nspName, userType) => {
    if (namespaceUsers[nspName] === undefined) {
        return {};
    }

    if (namespaceUsers[nspName][userType] === undefined) {
        return {};
    }

    return namespaceUsers[nspName][userType];
}

exports.createNamespaceObj = (nspName) => {
    if (namespaceUsers[nspName] === undefined){
        namespaceUsers[nspName] = {};
        return true;
    }

    return false;
}

exports.deleteNamespaceObj = (nspName) => {
    if (namespaceUsers[nspName] === undefined){
        return false;
    }

    delete namespaceUsers[nspName];
    return true;
}

module.exports.namespaceUsers = namespaceUsers;