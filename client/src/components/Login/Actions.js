import apiCaller from '../../apiHelper';

export async function newlogin({email, password, userType}) {
    console.log(email, password, userType);
    const {token, user} = await apiCaller( '/api/auth/login/'+userType, {email, password}, 200, data => data);//api, body, successCode, dataReturner
    localStorage.token = token;
    
    return user === undefined ? {name: "lumun", id: "lmnID"} : user; //!TODO: FIX LATER
}
