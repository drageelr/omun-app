import React, {Component} from 'react'
import {Button} from 'reactstrap'
import './Buttons.css'
import {Card, CardBody } from 'reactstrap';
import {leaveSeat , unRaise, raiseP} from '../VirtualAud/Actions';


let plaqNotification;

//   const mapDispatchToProps = (dispatch)=>{
//     return {
//         unSit:()=>dispatch(leaveSeat()),
//         raise:()=>dispatch(raiseP()),
//         unraise:()=>dispatch(unRaise()),
//         // plaqHandle:(len)=>dispatch(newNotification(plaqNotification)) //Dispatching To Change Plaq State and then adding a new notification 

//     }
//   }




const handleWindow=() =>{
    window.open('https://google.com')
}


function Buttons ({ seated,  unSit, raise, unraise , raised}) {
    const leave =()=>{
        (seated)? unSit():alert('You are not sitting');
    }
    const lower=()=>{
        (seated)?unraise():alert('You are not sitting');
        // plaqHandle('Lowered');
    }
    const Up=()=>{
        (seated)?raise():alert('You are not sitting');
        // plaqHandle('Raised');
    }
    // / Checking if Plaq is lowered or Raised
    
    return(
    <div>
        <Card style={{height:'16vh', backgroundColor:'#2D2B36', border:'0px'}}>
            
            <div className="button-container" style={{overflow:'auto'}}>
                {(raised)?<Button size="lg" onClick={lower} style={{border:'0.1vh solid black',backgroundColor:'white',color:'black'}}>Lower</Button>:<Button size="lg" color={'danger'} onClick={Up}>raise</Button>}
                <Button size="lg" onClick={handleWindow} className="Upload" color="secondary">Upload</Button>
                <Button size="lg" onClick={handleWindow} className="WorkingPaper" color="info">View Working Papers</Button>
                <Button size="lg" onClick={handleWindow} className="GSL" color="success">View GSL</Button>
                {(seated)?<Button size="lg" onClick={leave} color="danger">Leave Seat</Button>:<Button size="lg" style={{border:'0.1vh solid black',backgroundColor:'white',color:'black'}}>Not Seated</Button>}
                
            </div>
            
        </Card>
    </div>
    )
}
export default Buttons;