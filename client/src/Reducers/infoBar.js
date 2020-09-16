const initialState = {
    timerKey:0,
    timerOn:false,
    comittee:'Developing Mode',
    topic:'Sleep or no to sleep',
    speaker:'Turu obvio'
}

export const infoBar = (state=initialState , action={})=>{
    switch (action.type){
        case 'timerOn':
            return {...state , timerKey:state.timerKey+1,timerOn:true};
        case 'timerOff':
            return {...state , timerKey:state.timerKey+1,timerOn:false};
        case 'newSpeaker':
            return (action.payload==='') ? state:
            {...state ,timerKey:state.timerKey+1,timerOn:false, speaker:action.payload};
        case 'newTopic':
            return (action.payload==='') ? state:
            {...state ,timerKey:state.timerKey+1,timerOn:false, topic:action.payload};
        case 'newComittee':
            return (action.payload==='') ? state:
            {...state ,timerKey:state.timerKey+1,timerOn:false, comittee:action.payload};
        default : return state;
    }
}
