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

function Seat({isEmpty, placard, imageName, id, onClick}) {
    let classN = (isEmpty)? 'item': (placard)?'item raised':'item occupied';
    let imageN = (isEmpty)? {}: {backgroundImage:`url("${require(`./flag/${imageName}.png`)}")`,backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover', backgroundPosition:'center'};
    
    return (
        <div id={id} className={classN} onClick={onClick} style={imageN}></div>
    );
}

export default function VirtualAud({seats, placard, delegates, seated, sit}) {
    let initSeats = Array(50).fill({id: -1, delegateId: null, imageName: '', personality: '', placard: false}) //country == country image countryName here
    const [placement, setPlacement] = useState(initSeats);

    function toggleRaise() {
        
    }

    function toggleSeated() {
        
    }

    React.useEffect(() => {
        let updatedSeats = seats.map(seat => {
            let { countryName, imageName, personality } = delegates[seat.delegateId];
            return {...seat, countryName, imageName, personality};
        }); //add imageName and personality to seats from delegate's country

        setPlacement(updatedSeats)
    }, [seats])

    const clickSeat= (e)=>{
        const seatId = e.target.id;
        if(!placement[seatId].empty)
        {
            alert(placement[seatId].countryName); 
            return;
        }
        // (seated) ? alert('You are already seated') : sit(seatId);
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
                <Button variant="contained" size="small" startIcon={placard ? <MinimizeIcon/> : <CropLandscapeIcon/>} color="secondary" onClick={toggleRaise}> { placard ? "Lower Placard" : "Raise Placard" }  </Button>
                { 
                    true &&
                    <Button variant="contained" size="small" startIcon={<AirlineSeatLegroomNormalIcon/> } color="secondary" onClick={toggleSeated}>  { "Leave Seat" }   </Button>
                }
            </CardActions>
        </Card>
    );
}
