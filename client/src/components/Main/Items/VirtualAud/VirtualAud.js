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

function Seat({isEmpty, raised, country, id, onClick}) {
    let classN = (isEmpty)? 'item': (raised)?'item raised':'item occupied';
    let imageN = (isEmpty)? {}: {backgroundImage:`url("${require(`./flag/${country}.png`)}")`,backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover', backgroundPosition:'center'};
    
    return (
        <div id={id} className={classN} onClick={onClick} style={imageN}></div>
    );
}

export default function VirtualAud({raised, seated, sit}) {
    let dummyData = Array(50).fill({id: -1, empty: true, country: '', personality: '', raised: false}) //country == country image name here
    dummyData[0] = {id: '1', country:'pakistan', empty: false, raised: false}     
    dummyData[15] = {id: '2', country:'south-africa', empty: false, raised: true}     
    dummyData[46] = {id: '3', country:'japan', empty: false, raised: false}     

    const [placement, setPlacement] = useState(dummyData);

    function toggleRaise() {
        
    }

    function toggleSeated() {
        
    }


    const clickSeat= (e)=>{
        if(!placement[e.target.id]['empty'])
        {
            alert(placement[e.target.id]['country']); 
            return;
        }
        (seated) ? alert('You are already seated') : sit(e.target.id);
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
                    isEmpty={s.empty} 
                    country={s.country} 
                    person={s.personality} 
                    raised={s.raised} 
                    onClick={clickSeat}
                    />
                )
            }
            </CardContent>
            <CardActions>
                <Button variant="contained" size="small" startIcon={raised ? <MinimizeIcon/> : <CropLandscapeIcon/>} color="secondary" onClick={toggleRaise}> { raised ? "Lower Placard" : "Raise Placard" }  </Button>
                { 
                    true &&
                    <Button variant="contained" size="small" startIcon={<AirlineSeatLegroomNormalIcon/> } color="secondary" onClick={toggleSeated}>  { "Leave Seat" }   </Button>
                }
            </CardActions>
        </Card>
    );
}
