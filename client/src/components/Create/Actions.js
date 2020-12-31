import apiCaller from '../../apiHelper';

export async function send(packet,mode) {
    console.log("send",packet,mode);
    const res = await apiCaller( '/api/account/create/'+mode, packet, 200);//api, body, successCode, dataReturner
    if (typeof(res)=="string"){ //error string
        throw res;
    }
    return res.ids; 
};

export async function fetch(packet) {
    const res = await apiCaller( '/api/account/fetch-accounts', packet, 200);//api, body, successCode, dataReturner
    if (typeof(res)=="string"){ //error string
        throw res;
    }
    return res.data; 
};
