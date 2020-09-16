import React, { Component } from 'react';
import {Card, CardBody, CardHeader, CardText } from 'reactstrap';
import {connect} from 'react-redux';
import {newNotification} from './Actions'


const mapStateToProps =(state)=>{
    return{
        newNotification:state.notifReducer.Notification
    }
}

const mapDispatchToProps =(dispatch) =>{
    return{
        addNotification:()=>{
            let payload =prompt('enter');
            dispatch(newNotification(payload))
        }
    }
        
}



class Notification extends Component {
        
    render() { 
        const {addNotification,newNotification}=this.props;
        return ( 
            <div className="cardBody">
                <Card style={{height:"22vh"}} >
                    <CardHeader> Notifications</CardHeader>
                    <CardBody onClick={addNotification} style={{overflowY: "scroll"}}>
                        <CardText>{newNotification.map((item,i)=>{return <ul style={{margin:'auto', paddingRight:'5px'}} key={i}><li>{item}</li></ul>})}</CardText>
                    </CardBody>
                </Card>
            </div>
         );
    }
}
 
export default connect(mapStateToProps,mapDispatchToProps)(Notification);