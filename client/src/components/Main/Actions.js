import apiCaller from '../../apiHelper';

export async function start(packet) {
    console.log("start",packet);
    const res = await apiCaller('/api/session/start', packet, 200);//api, body, successCode, dataReturner
    if (typeof(res)=="string"){ //error string
        throw res;
    }
    return res; 
};

export async function end(packet) {
    console.log("end",packet);
    const res = await apiCaller('/api/session/stop', packet, 200);//api, body, successCode, dataReturner
    if (typeof(res)=="string"){ //error string
        throw res;
    }
    return res; 
};

export async function fetchCommittees() {
    const res = await apiCaller( '/api/account/fetch-accounts', {attributes:["id", "initials"], accountType: "committee"}, 200);//api, body, successCode, dataReturner
    if (typeof(res)=="string"){ //error string
        throw res;
    }

    let initialIdMap = {}
    res.data.forEach((row) => {
        initialIdMap[row[1]] = row[0]; //initial key, id value
    })
    
    return initialIdMap; //first index has the id
};