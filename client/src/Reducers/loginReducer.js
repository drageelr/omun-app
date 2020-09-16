

const initialState ={
    email:'',
    password:'',
    stayLogged:false
}

export const loginReducer=(state=initialState,actions={}) =>{
    switch(actions.type){
        case 'newLogin':
            return {
                ...state,
                [actions.id]:actions.payload
            }
        case 'rememberMe':{
            return{
                ...state,
                stayLogged:actions.payload
            }
        }    
        default: return{state}
    }  
    
}