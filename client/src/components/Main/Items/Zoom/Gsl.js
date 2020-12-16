import React, {useState, useEffect} from 'react'
import {addToList,removeFromList} from './Actions'
import './Gsl.css'

function Gsl({tempToList, placement}) {
    const toggle=(e)=>{
        (tempToList && tempToList.includes(e.target.id)) ? removeFromList(e.target.id) : addToList(e.target.id);
    }
    
    let occupied = placement && Object.values(placement).filter((item,i)=>{
        return item.empty === false 
    })

    return(
        <div>
            <ul>
                {   
                    occupied &&
                    occupied.map(function(item){
                    const stylee=(tempToList && tempToList.includes(item.country))?'crossed' : 'not';
                    return <p id={item.country} onClick={toggle} className={stylee}>{item.country}</p>
                })}
            </ul>
        </div>
    )
}

export default Gsl;