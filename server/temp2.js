'use strict'

const redis = require('redis');
const redis_client = redis.createClient();
const util = require('util');

redis_client.on('error', function(err) {
    console.log(err);
});

redis_client.on('connect', function() {
    console.log("Connected!");
})

let getKey = util.promisify(redis_client.hget).bind(redis_client);
let setKey = util.promisify(redis_client.hset).bind(redis_client);
let delKey = util.promisify(redis_client.hdel).bind(redis_client);
let getAllKey = util.promisify(redis_client.hgetall).bind(redis_client);
let delAllKey = util.promisify(redis_client.del).bind(redis_client);

/**
 * '/committeeId': { 'type': {id: 'socketId'} }
 * "committeeId" is an integer which denotes namespace
 * "type" is a string which denotes "admin", "dias" or "delegate"
 * "id" is an integer represents user's id in DB
 * "socketId" is a string that represents the unique id of the user in the connected namespace
 */
let namespaceUsers = {};

let fetchSocketId = async (nspName, userType, userId) => {
    return await getKey(nspName, userType + '|' + userId);
}

let addUser = async (nspName, userType, userId, socketId) => {
    let oldsocketId = await getKey(nspName, userType + "|" + userId);
    if (!oldsocketId) {
        await setKey(nspName, userType + '|' + userId, socketId);
        return true;
    }

    return false;
}

let deleteUser = async (nspName, userType, userId) => {
    let oldsocketId = await getKey(nspName, userType + '|' + userId);
    if (!oldsocketId) { return false; }
    await delKey(nspName, userType + '|' + userId);

    return true;
}

let fetchUsers = async (nspName, userType) => {
    let allUsers = await getAllKey(nspName);
    let typeAndId = Object.keys(allUsers);
    let result = [];
    for (let i = 0; i < typeAndId.length; i++) {
        let splitValues = typeAndId[i].split("|");
        if (splitValues[0] == userType) { result.push(splitValues[1]); }
    }

    return result;
}

exports.createNamespaceObj = (nspName) => {
    return false;
}

let deleteNamespaceObj = async (nspName) => {
    let allUsers = await getAllKey(nspName);
    console.log(allUsers);
    if (!allUsers) {
        return false;
    }

    await delAllKey(nspName);
    return true;
}

// addUser("/1", "admin", "1", "abcd")
// console.log('addUser("/1", "admin", "1", "abcd"):', );
// console.log('fetchSocketId("/1", "admin", "1"):',  fetchSocketId("/1", "admin", "1"));

// setTimeout(
//     (
//         async function () {
//             // let val = await addUser("/1", "admin", "2", "efgh");
//             // console.log(val);
//             // console.log('addUser("/1", "admin", "1", "abcd"):', val);
//             // let val = await fetchUsers("/1", "admin");
//             // console.log(val);
//             let val = await deleteNamespaceObj("/1");
//             console.log(val);
//         }
//     ),
//     1000
// )


// (
//     async function () {
//         let val = await fetchSocketId("/1", "admin", "1");
//         console.log('fetchSocketId("/1", "admin", "1"):', val);
//     }
// )();