import apiCaller from '../../apiHelper';

export async function send(packet,mode) {
    console.log("send",packet,mode);
    const ids = await apiCaller( '/api/account/create/'+mode, packet, 200, data => data);//api, body, successCode, dataReturner
    
    return ids === undefined ? ["-1"] : ids; 
};
