import apiCaller from '../../apiHelper';

export async function send(packet,mode) {
    console.log("send",packet,mode);
    const resp = await apiCaller( '/api/account/create/'+mode, packet, 200, data => data);//api, body, successCode, dataReturner
    
    return resp === undefined ? ["-1"] : resp; 
};

export async function start(packet) {
    console.log("start",packet);
    const resp = await apiCaller( '/api/session/start', packet, 200, data => data);//api, body, successCode, dataReturner
    
    return resp === undefined ? ["-1"] : resp; 
};

export async function end(packet) {
    console.log("end",packet);
    const resp = await apiCaller( '/api/session/stop', packet, 200, data => data);//api, body, successCode, dataReturner
    
    return resp === undefined ? ["-1"] : resp; 
};

export async function join(packet) {
    console.log("join",packet);
    const resp = await apiCaller( '/api/session/join', packet, 200, data => data);//api, body, successCode, dataReturner
    return resp === undefined ? ["-1"] : resp; 
};
