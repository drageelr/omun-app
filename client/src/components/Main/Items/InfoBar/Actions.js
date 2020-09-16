export const toggleTimerOn = ()=>{
    return ({
        type:'timerOn',
        payload:''
    });
}

export const toggleTimerOff = ()=>{
    return ({
        type:'timerOff',
        payload:''
    });
}

export const newSpeaker = (pay)=>{
    return ({
        type:'newSpeaker',
        payload:pay
    });
}
export const newTopic = (pay)=>{
    return ({
        type:'newTopic',
        payload:pay
    });
}
export const newComittee = (pay)=>{
    return ({
        type:'newComittee',
        payload:pay
    });
}


export const requestAPI = (dispatch , url)=>{
    dispatch({ type: 'apiWaiting'});
    fetch(url)
    .then(response=> response.json())
    .then(data=>dispatch({type:'apiSuccess', payload:data}))
    .catch(error=>dispatch({type:'apiFail' , payload:error}))
}