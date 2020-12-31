import apiCaller from '../../apiHelper';

export async function newlogin({email, password, userType}) {
    const res = await apiCaller( '/api/auth/login/'+userType, {email, password}, 200);//api, body, successCode, dataReturner
    if (typeof(res)=="string"){ //error returned from server
        throw res;
    }
    const {token, user} = res;
    sessionStorage.token = token; // set token to sessionStorage
    var toRet= {...user, type: userType};
    sessionStorage.setItem('user',JSON.stringify(toRet)) ;
    return toRet
}

export async function changePassword(packet) {
    const res = await apiCaller( '/api/account/change-password', packet, 200);//api, body, successCode, dataReturner
    if (typeof(res)=="string"){ //error returned from server
        throw res;
    } 
};