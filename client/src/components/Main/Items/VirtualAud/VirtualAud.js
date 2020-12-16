import React, { useState, useEffect } from 'react';
import {Card, CardBody } from 'reactstrap';
import './VirtualAud.css';
import {onSeat} from './Actions';
import Seat from './Seat';


const handleClick = () =>{
    console.log('Clicked')
}

function VirtualAud ({ seated, placement, sit}) {
    const clickSeat= (e)=>{
        if(!placement[e.target.id]['empty'])
        {
            alert(placement[e.target.id]['country']); 
            return;
        }
        (seated) ? alert('You are already seated') : sit(e.target.id);
    }

    return ( 
    <div>
        <Card style={{height:"40vh"}} className={'bodyM'}>
            <CardBody className="innerGrid">
                { 
                    placement && 
                    Object.values(placement).map((v,i)=>{
                        return <Seat key={v['id']} id={v['id']} isEmpty={v['empty']} country={v['country']} person={v['person']} raised={v['raised']} onClick={clickSeat}/>
                    })
                }
                <div style={{border:'2px'}}> </div><div style={{border:'2px'}}> </div><div style={{border:'2px'}}> </div><div style={{border:'2px'}}> </div>
                <div style={{border:'2px'}}> </div><div style={{border:'2px'}}> </div><div style={{border:'2px'}}> </div><div style={{border:'2px'}}> </div>
                <div style={{border:'2px'}}> </div><div style={{border:'2px'}}> </div>
                <div style={{border:'2px'}}> </div>
                <div style={{border:'2px'}}> </div>
                <div onClick={handleClick} id=""className={'item'}>dias</div>
                <div onClick={handleClick} id=""className={'item'}>dias</div>
                <div onClick={handleClick} id=""className={'item'}>dias</div>
                <div onClick={handleClick} id=""className={'item'}>dias</div>
                <div onClick={handleClick} id=""className={'item'}>dias</div>
                <div onClick={handleClick} id=""className={'item'}>dias</div>
                <div style={{border:'2px'}}> </div>
            </CardBody>
        </Card>
    </div> 
    );
}
 
export default VirtualAud;