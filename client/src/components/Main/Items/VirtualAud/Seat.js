import React, { Component } from 'react';
import './VirtualAud.css';

class Seat extends Component {
render(){
    let classN = (this.props.isEmpty)? 'item': (this.props.raised)?'item raised':'item occupied';
    let imageN = (this.props.isEmpty)? {}: {backgroundImage:`url("${require(`./flag/${this.props.country}.png`)}")`,backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover', backgroundPosition:'center'};
    return <div id={this.props.id} className={classN} onClick={this.props.onClick} style={imageN}></div>
    }
}

export default Seat;