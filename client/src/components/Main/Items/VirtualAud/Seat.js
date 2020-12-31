import React, { Component } from 'react';
import './VirtualAud.css';

function Seat({isEmpty, raised, country, id, onClick}) {
    let classN = (isEmpty)? 'item': (raised)?'item raised':'item occupied';
    let imageN = (isEmpty)? {}: {backgroundImage:`url("${require(`./flag/${country}.png`)}")`,backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover', backgroundPosition:'center'};
    
    return (
        <div id={id} className={classN} onClick={onClick} style={imageN}></div>
    );
}

export default Seat;