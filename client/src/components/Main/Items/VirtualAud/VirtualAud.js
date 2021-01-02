import React, { useState, useEffect } from 'react';
// import {Card, CardBody } from 'reactstrap';
import './VirtualAud.css';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import AirlineSeatLegroomNormalIcon from '@material-ui/icons/AirlineSeatLegroomNormal';
import CropLandscapeIcon from '@material-ui/icons/CropLandscape';
import MinimizeIcon from '@material-ui/icons/Minimize';

function Seat({isEmpty, placard, countryName, imageName, id, onClick}) {
    let classN = (isEmpty)? 'item': (placard)?'item raised':'item occupied';
    try {
        let imageN = (isEmpty)? {}: {backgroundImage:`url("${require(`./flag/${imageName}.png`)}")`,backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover', backgroundPosition:'center'};
        return (
            <div id={id} className={classN} onClick={onClick} style={imageN}></div>
        );
    }
    catch { // image not found
        return (
            <div id={id} className={classN} onClick={onClick}>{countryName}</div>
        );
    }
    
}

export default function VirtualAud({id, type, seats, placard, delegates, seated, sit, unsit, togglePlacard}) {
    let initSeats = Array(50).fill({id: -1, delegateId: null, imageName: '', personality: '', placard: false}) //country == country image countryName here
    const [placement, setPlacement] = useState(initSeats);

    React.useEffect(() => {
        if (delegates) {
            let updatedSeats = seats.map(seat => {
                if (seat.delegateId != null) {
                    let { countryName, imageName, personality } = delegates[seat.delegateId];
                    return {...seat, countryName, imageName, personality};
                }
                else {
                    return seat;
                }
            }); //add imageName and personality to seats from delegate's country
            setPlacement(updatedSeats);
        }
    }, [seats])

    function clickSeat(e) {
        if (type == 'delegate') { // function only works for delegates
            const seatId = parseInt(e.target.id);
            console.log('clickSeat', seatId, placement[seatId])
            if(placement[seatId] && placement[seatId].delegateId === null) { //seat clicked exists and is empty   
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
                    key={i} 
                    id={s.id}
                    countryName={s.countryName}
                    isEmpty={s.delegateId === null} //no one sitting
                    imageName={s.imageName} 
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
                    <div>
                        <Button variant="contained" size="small" startIcon={placard ? <MinimizeIcon/> : <CropLandscapeIcon/>} color="secondary" onClick={() => togglePlacard(!placard)}> { placard ? "Lower Placard" : "Raise Placard" }  </Button>                    
                        <Button variant="contained" size="small" startIcon={<AirlineSeatLegroomNormalIcon/> } color="secondary" onClick={unsit}>  { "Leave Seat" }   </Button>
                    </div>
                }
            </CardActions>
        </Card>
    );
}
