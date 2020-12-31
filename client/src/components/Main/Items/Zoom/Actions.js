export const newMessage = (message,country)=>{
    return ({
        type:'newMessage',
        payload:{message:message,to:country}
    });
};

export const addToList=(country)=>{
    console.log('add to list',country);
    return({
        type:'addTemp',
        payload:country
    });
};
export const removeFromList=(country)=>{
    return({
        type:'removeFromList',
        payload:country
    });
};

export const typing=(e)=>{
    return({
        type:'typing',
        payload:e
    })
};