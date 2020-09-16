export const newlogin = (payload,id)=>{
    return ({
        type:'newLogin',
        payload:payload,
        id:id,
    });
}

export const rememberButton =(payload)=>{
    return({
        type:'rememberMe',
        payload:payload
    })
}