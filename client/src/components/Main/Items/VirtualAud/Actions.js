export const leaveSeat =()=>{
    return({
        type:'unSeat',
        payload:''
    })
};
export const onSeat=(id)=>{
    return ({
        type:'seat',
        payload:id
    })
}

export const raiseP=()=>{
    return ({
        type:'raiseP',
        payload:''
    })
}
export const unRaise=()=>{
    return ({
        type:'unRaise',
        payload:''
    })
}