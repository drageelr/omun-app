import React, {useState, useEffect} from 'react'
import {addToList,removeFromList} from './Actions'
import './UserList.css'

function UserList({tempToList, placement}) {

    const toggle=(e)=>{
        (tempToList.includes(e.target.id)) ? removeFromList(e.target.id) : addToList(e.target.id);
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
                    const stylee=(tempToList.includes(item.country))?'f6 link dim br-pill ph3 pv2 mb2 dib white bg-purple' : 'f6 link dim br-pill ph3 pv2 mb2 dib white bg-mid-gray';
                    return <li id={item.country} onClick={toggle} className={stylee} >{item.country}</li>
                })
                }
            </ul>
        </div>
    )
}

export default UserList;