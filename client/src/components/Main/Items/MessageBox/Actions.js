export const newMessage = (message,country)=>{
    return ({
        type:'newMessage',
        payload:message,
        userTo:country
    });
}