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

function VirtualAud ({raised, seated, sit}) {
    let dummyData = {
        '10':{ id:'10', empty:false , country:'japan' , person:'no'}, '11':{ id:'11', empty:true , country:'' , person:''}, '12':{ id:'12', empty:true , country:'' , person:''}, '13':{ id:'13', empty:true , country:'' , person:''}, '15':{ id:'15', empty:true , country:'' , person:''}, '16':{ id:'16', empty:true , country:'' , person:''}, '17':{ id:'17', empty:true , country:'' , person:''}, '18':{ id:'18', empty:true , country:'' , person:''}, '19':{ id:'19', empty:true , country:'' , person:''}, '20':{ id:'20', empty:false , country:'pakistan' , person:'TYUY'}, 
        '21':{ id:'21', empty:true , country:'' , person:''}, '22':{ id:'22', empty:true , country:'' , person:''}, '23':{ id:'23', empty:true , country:'' , person:''}, '24':{ id:'24', empty:true , country:'' , person:''}, '25':{ id:'25', empty:true , country:'' , person:''}, '26':{ id:'26', empty:true , country:'' , person:''}, '27':{ id:'27', empty:false , country:'sri-lanka' , person:'RONO'}, '28':{ id:'28', empty:true , country:'' , person:''}, '29':{ id:'29', empty:true , country:'' , person:''}, '30':{ id:'30', empty:true , country:'' , person:''}, 
        '31':{ id:'31', empty:false , country:'south-africa' , person:'Turu'}, '32':{ id:'32', empty:true , country:'' , person:''}, '33':{ id:'33', empty:true , country:'' , person:''}, '34':{ id:'34', empty:true , country:'' , person:''}, '35':{ id:'35', empty:true , country:'' , person:''}, '36':{ id:'36', empty:true , country:'' , person:''}, '37':{ id:'37', empty:true , country:'' , person:''}, '38':{ id:'38', empty:true , country:'' , person:''}, '39':{ id:'39', empty:true , country:'' , person:''}, '40':{ id:'40', empty:true , country:'' , person:''}, 
        '41':{ id:'41', empty:true , country:'' , person:''}, '42':{ id:'42', empty:false , country:'usa' , person:'SASHA'}, '43':{ id:'43', empty:false , country:'india' , person:'af'}, '44':{ id:'44', empty:true , country:'' , person:''}, '45':{ id:'45', empty:false , country:'germany' , person:'BRUCE'}, '46':{ id:'46', empty:true , country:'' , person:''}, '47':{ id:'47', empty:true , country:'' , person:''}, '48':{ id:'48', empty:true , country:'' , person:''}, '49':{ id:'49', empty:true , country:'' , person:''}, '50':{ id:'50', empty:false , country:'ivory-coast' , person:'VLAD'},
        '51':{ id:'51', empty:false , country:'france' , person:'HAMI'}, '52':{ id:'52', empty:true , country:'' , person:''}, '53':{ id:'53', empty:true , country:'' , person:''}, '54':{ id:'54', empty:true , country:'' , person:''}, '55':{ id:'55', empty:true , country:'' , person:''}, '56':{ id:'56', empty:true , country:'' , person:''}, '57':{ id:'57', empty:true , country:'' , person:''}, '58':{ id:'58', empty:true , country:'' , person:''}, '59':{ id:'59', empty:true , country:'' , person:''}, '60':{ id:'60', empty:true , country:'' , person:''}
    };

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

    function Seat({isEmpty, raised, country, id, onClick}) {
        let classN = (isEmpty)? 'item': (raised)?'item raised':'item occupied';
        let imageN = (isEmpty)? {}: {backgroundImage:`url("${require(`./flag/${country}.png`)}")`,backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover', backgroundPosition:'center'};
        
        return (
            <div id={id} className={classN} onClick={onClick} style={imageN}></div>
        );
    }

    return ( 
        <Card className="redBG">
            <CardContent className="innerGrid">
            { 
                placement && 
                Object.values(placement).map((v,i)=>{
                    return <Seat key={v['id']} id={v['id']} isEmpty={v['empty']} country={v['country']} person={v['person']} raised={v['raised']} onClick={clickSeat}/>
                })
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
 
export default VirtualAud;