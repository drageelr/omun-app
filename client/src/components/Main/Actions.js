import apiCaller from '../../apiHelper';

export async function send(packet,mode) {
    console.log("send",packet,mode);
    const res = await apiCaller( '/api/account/create/'+mode, packet, 200);//api, body, successCode, dataReturner
    if (typeof(res)=="string"){ //error string
        throw res;
    }
    return res.ids; 
};

export async function start(packet) {
    console.log("start",packet);
    const res = await apiCaller( '/api/session/start', packet, 200);//api, body, successCode, dataReturner
    
    return res === undefined ? ["-1"] : res; 
};

export async function end(packet) {
    console.log("end",packet);
    const res = await apiCaller( '/api/session/stop', packet, 200);//api, body, successCode, dataReturner
    
    return res === undefined ? ["-1"] : res; 
};

export async function join(packet) {
    console.log("join",packet);
    const res = await apiCaller( '/api/session/join', packet, 200);//api, body, successCode, dataReturner
    return res === undefined ? ["-1"] : res; 
};
