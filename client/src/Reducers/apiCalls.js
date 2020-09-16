
export const apiCalls = (state={apiResponse:''},action={})=>{
    switch(action.type){
        case 'apiSuccess':
            return {...state,apiResponse:action.payload};
        case 'apiFail':
            return state;
        case 'apiWaiting':
            return state;
        default : return state;
    }
}