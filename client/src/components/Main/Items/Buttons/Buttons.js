import React, {Component} from 'react'
import {Button} from 'reactstrap'
import './Buttons.css'
import {Card, CardBody } from 'reactstrap';
import {connect} from 'react-redux';
import {leaveSeat, raiseP , unRaise} from '../VirtualAud/Actions';


const mapStateToProps = (state)=>{
    return {
      seated:state.virAud.seated,
      placement:state.virAud.placement,
      raised:state.virAud.raised
    }
  }

  const mapDispatchToProps = (dispatch)=>{
    return {
        unSit:()=>dispatch(leaveSeat()),
        raise:()=>dispatch(raiseP()),
        unraise:()=>dispatch(unRaise())
    }
  }


const handleClick = () =>{
    console.log('Clicked')
}


class Buttons extends Component {
    render(){
        const { seated,  unSit} = this.props;
        const leave =()=>{
            (seated)? unSit():alert('You are not sitting');
        }
        return(
        <div>
            <Card style={{height:'16vh'}}>
                <CardBody>
                <div className="button-container" style={{overflow:'auto'}}>
                    <Button onClick={handleClick} className="P" color="primary">R/UR Plaq</Button>
                    <Button onClick={handleClick} color="secondary">Upload/View W.P</Button>
                    <Button onClick={handleClick} color="success">View GSL</Button>
                    <Button onClick={handleClick} color="warning">Join B</Button>
                    {(seated)?<Button onClick={leave} color="danger">Leave Seat</Button>:<Button  style={{border:'0.1vh solid black',backgroundColor:'white',color:'black'}}>Not Seated</Button>}
                    
                </div>
                </CardBody>
            </Card>
        </div>
        )
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Buttons);