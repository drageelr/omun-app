import React, { useState, useEffect } from 'react';
import './VirtualAud.css';
import { Button, Card, CardActions, CardContent, Typography, Tooltip, Menu, MenuItem } from '@material-ui/core';
import AirlineSeatLegroomNormalIcon from '@material-ui/icons/AirlineSeatLegroomNormal';
import CropLandscapeIcon from '@material-ui/icons/CropLandscape';
import MinimizeIcon from '@material-ui/icons/Minimize';

const initialState = {
    mouseX: null,
    mouseY: null,
};

function Seat({isEmpty, placard, countryName, imageName, id, delegateId, onClick, initials, canEdit, notYou, setChatId, addToGSL, addToRSL, monitorDelegate}) {
    let classN = (isEmpty)? 'item': (placard)?'item raised':'item occupied';
    const [state, setState] = useState(initialState);

    function handleClick(event) {
        event.preventDefault(); // right click
        setState({ mouseX: event.clientX - 2, mouseY: event.clientY - 4 });
    };

    function handleClose() {
        setState(initialState);
    };


    function SeatDiv({imageN}) {
        return (
            
            <>  
                {   
                    isEmpty 
                    ? <div id={id} className={classN} onContextMenu={handleClick} onClick={onClick}></div>
                    : 
                    <Tooltip title={countryName}>
                        <div id={id} className={classN} onContextMenu={handleClick} onClick={onClick} style={imageN ? imageN : {}}>{!imageN && initials}</div>
                    </Tooltip>
                }
                
                {
                    (notYou || canEdit) && !isEmpty &&
                    <Menu keepMounted open={state.mouseY !== null} onClose={handleClose} anchorReference="anchorPosition"
                    anchorPosition={ state.mouseY !== null && state.mouseX !== null ? { top: state.mouseY, left: state.mouseX } : undefined }>
                    <MenuItem onClick={()=>{ setChatId(`${delegateId}|delegate`); handleClose(); }}>Chat {countryName && 'with ' + countryName}</MenuItem>   
                    {
                        canEdit &&
                        <>
                        <MenuItem onClick={()=>{ addToGSL(delegateId); handleClose();}}>Add to GSL</MenuItem>
                        <MenuItem onClick={()=>{ addToRSL(delegateId); handleClose();}}>Add to RSL</MenuItem>
                        <MenuItem onClick={()=>{ monitorDelegate(delegateId); handleClose();}}>Monitor Chat</MenuItem>
                        </>
                    }
                    </Menu>
                }
            </>
        )
    }

    try {
        let imageN = (isEmpty)? {}: {backgroundImage:`url("${require(`../flag/${imageName}.png`)}")`,backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover', backgroundPosition:'center'};
        return (
            <SeatDiv imageN={imageN}/>
        );
    }
    catch { // image not found
        return (
            <SeatDiv/>
        );
    }
    
}

export default function VirtualAud({id, type, seats, placard, delegates, seated, sit, unsit, togglePlacard, setChatId, addToGSL, addToRSL, monitorDelegate}) {
    const [placement, setPlacement] = useState([]);
    const [placardsRaised, setPlacardsRaised] = useState(0);
    const [seatedCount, setSeatedCount] = useState(0);

    

    React.useEffect(() => {
        let numPlacards = 0;
        let numSeated = 0;
        let updatedSeats = seats.map(seat => {
            if (seat.delegateId != null) {
                numSeated++; //side job to store seats and placards count
                if (seat.placard) {
                    numPlacards++;
                }

                let { countryName, imageName, personality } = delegates[seat.delegateId];
                return {...seat, countryName, imageName, personality};
            }
            else {
                return seat;
            }
        }); //add imageName and personality to seats from delegate's country
        setPlacement(updatedSeats);
        setPlacardsRaised(numPlacards);
        setSeatedCount(numSeated);
    }, [seats])

    function clickSeat(e) {
        if (type == 'delegate') { // function only works for delegates
            const seatId = parseInt(e.target.id);
            if(placement[seatId-1] && placement[seatId-1].delegateId === null) { //seat clicked exists and is empty   
                if (seated) {
                    alert('You are already seated.');
                } 
                else {
                    //seat id starts from 1 (arr from 0)
                    sit(seatId);
                }    
            }
        }
    }

    

    return ( 
        <Card className="redBG">
            <CardContent className="innerGrid">
            { 
                placement && 
                placement.map((s,i)=> 
                    <Seat 
                    key={s.id} 
                    id={s.id}
                    notYou={s.delegateId !== id}
                    delegateId={s.delegateId}
                    canEdit={type==='dias'}
                    setChatId={setChatId}
                    addToGSL={addToGSL} 
                    addToRSL={addToRSL} 
                    monitorDelegate={monitorDelegate}
                    countryName={s.countryName}
                    isEmpty={s.delegateId === null} //no one sitting
                    imageName={s.imageName} 
                    initials={delegates[s.delegateId] && delegates[s.delegateId].initials}
                    person={s.personality} 
                    placard={s.placard} 
                    onClick={clickSeat}
                    />
                )
            }
            </CardContent>
            <CardActions>
                {   
                    // if you are a seated delegate, then show Placard Toggle and Leave Seat buttons
                    type == "delegate" && seated &&
                    <Button variant="contained" size="small" startIcon={placard ? <MinimizeIcon/> : <CropLandscapeIcon/>} color="secondary" onClick={() => togglePlacard(!placard)}> { placard ? "Lower Placard" : "Raise Placard" }  </Button>                
                }
                {
                    type == "delegate" && seated &&
                    <Button variant="contained" size="small" startIcon={<AirlineSeatLegroomNormalIcon/> } color="secondary" onClick={unsit}>  { "Leave Seat" }   </Button>
                }
                <Typography style={{fontSize: 14}} color='secondary'>Placards Raised: {placardsRaised}</Typography>
                <Typography style={{fontSize: 14}} color='secondary'>Delegates Seated: {seatedCount}</Typography>
            </CardActions>
        </Card>
    );
}
