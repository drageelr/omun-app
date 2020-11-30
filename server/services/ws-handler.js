'use strict'

const hFuncs = require('../services/helper-funcs');


exports.wsMessageHandler = async (msg, ws) => {
    try {
        let msgObj = JSON.parse(msg);

        if (msgObj.type == "GET_INITIAL_DATA") {
            
            // ws.send(JSON.stringify(res));
        } else if (msgObj.type == "ECHO") {
            let res = {
                type: "DATA",
                message: msgObj.echo
            }

            ws.send(JSON.stringify(res));
        }
    } catch(e) {
        console.log(e);
    }
}