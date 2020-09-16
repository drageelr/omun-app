const initialState={
    Notification:[],
}

export const notifReducer=(state=initialState,action={}) =>{
    switch(action.type){
        case 'newNotification':{
            return (action.payload==='') ? state:
            {...state, Notification:state.Notification.concat(action.payload)}
            
        }default: return state;
    }

}