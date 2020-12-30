import apiCaller from '../../apiHelper';

export async function newlogin({email, password, userType}) {
    console.log(email, password, userType);
    const res = await apiCaller( '/api/auth/login/'+userType, {email, password}, 200, data => data);//api, body, successCode, dataReturner
    if (typeof(res)=="string"){ //error returned from server
        throw res;
    }
    const {token, user} = res;
    localStorage.token = token; // set token to localStorage
    return {...user, type: userType};
}

export async function changePassword(packet) {
    console.log("reset",packet);
    const res = await apiCaller( '/api/account/change-password', packet, 200, data => data);//api, body, successCode, dataReturner
    if (typeof(res)=="string"){ //error returned from server
        throw res;
    }
    console.log(res);
    return res; 
};