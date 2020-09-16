
const initialstate ={
    message:[],
    userFrom:'',
    userTo:'',
}

export const MsgReducer =(state=initialstate,action={}) =>{
    switch(action.type){
        case 'newMessage':
            return(action.payload==='') ? state:
            {...state, message:state.message.concat(action.payload)}
        default:return state;
    }
}