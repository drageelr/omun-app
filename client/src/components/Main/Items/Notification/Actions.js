export const newNotification = (payload)=>{
    return ({
        type:'newNotification',
        payload:payload
    });
}