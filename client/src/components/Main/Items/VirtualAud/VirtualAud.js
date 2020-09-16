import React, { Component } from 'react';
import {Card, CardBody } from 'reactstrap';
import './VirtualAud.css';
import {connect} from 'react-redux'
import {onSeat} from './Actions';
import Seat from './Seat';

const mapStateToProps = (state)=>{
    return {
      seated:state.virAud.seated,
      myID:state.virAud.myID,
      placement:state.virAud.placement,
    }
  }

  const mapDispatchToProps = (dispatch)=>{
    return {
        sit:(ID)=>{
            dispatch(onSeat(ID));
        }
    }
  }
const handleClick = () =>{
    console.log('Clicked')
}

class VirtualAud extends Component {
    render() { 
        const { seated, placement,sit} = this.props;
        const clickSeat= (e)=>{
            if(!placement[e.target.id]['empty']){alert(placement[e.target.id]['country']); return;}
            (seated) ? alert('You are already seated') : sit(e.target.id);
        }

        return ( 
        <div>
                <Card style={{height:"40vh"}}>
                    <CardBody className="innerGrid">
                        {Object.values(placement).map((v,i)=>{
                            return <Seat key={v['id']} id={v['id']} isEmpty={v['empty']} country={v['country']} person={v['person']} onClick={clickSeat}/>
                            })}
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
}
 
export default connect(mapStateToProps,mapDispatchToProps)(VirtualAud);