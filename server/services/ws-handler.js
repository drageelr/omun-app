'use strict'

const Admin = require('../models/admin.model');
const Dias = require('../models/dias.model');
const Delegate = require('../models/delegate.model');
const Committee = require('../models/committee.model');
const Chat = require('../models/chat.model');
const SL = require('../models/sl.model');
const Vote = require('../models/vote.model');
const Block = require('../models/block.model');
const hFuncs = require('../services/helper-funcs');


exports.wsMessageHandler = async (msg, ws) => {
    try {
        let msgObj = JSON.parse(msg);

        if (msgObj.type == "GET_INITIAL_DATA") {
            let reqDelegates = await Delegate.find({committeId: ws.committeId}, 'delegateId name country committeeId placard blockId');
            reqDelegates = hFuncs.createArrFromObjArr(reqDelegates, ["delegateId", "name", "country", "committeeId", "placard", "blockId"]);
        
            let reqAdmins = await Admin.find({}, 'adminId name');
            reqAdmins = hFuncs.createArrFromObjArr(reqAdmins, ["adminId", "name"]);

            let reqDias = await Dias.find({}, 'diasId name');
            reqDias = hFuncs.createArrFromObjArr(reqDias, ["diasId", "name"]);

            let reqCommittee = await Committee.findById(ws.user.committeId, 'committeeId name sessionStatus seats notifications');
            let seats = hFuncs.createArrFromObjArr(reqCommittee.seats, ["seatId", "blocked", "delegateId"]);
            let notifications = hFuncs.createArrFromObjArr(reqCommittee.notifications, ["content", "diasId", "createdAt"]);
            reqCommittee = hFuncs.duplicateObject(reqCommittee, ["committeId", "name", "sessionStatus"]);
            reqCommittee.seats = seats;
            reqCommittee.notifications = notifications;

            let reqBlocks = await Block.find({committeId: ws.user.committeId}, 'name color');
            reqBlocks = hFuncs.createArrFromObjArr(reqBlocks, ["name", "color"]);

            let reqSLs = await SL.find({committeId: ws.user.committeId}, 'slId name delegateIds createdAt');
            let SLs = [];
            for (let i = 0; i < reqSLs.length; i++) {
                let sl = {
                    slId: reqSLs[i].slId,
                    name: reqSLs[i].name,
                    delegateIds: reqSLs[i].delegateIds.map((j) => j),
                    createdAt: reqSLs[i].createdAt,
                };
                SLs.push(sl);
            }
            reqSLs = SLs;

            let res = {
                type: "RES",
                delegates: reqDelegates,
                admins: reqAdmins,
                dias: reqDias,
                committee: reqCommittee,
                blocks: reqBlocks,
                sls: reqSLs
            }

            ws.send(JSON.stringify(res));
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