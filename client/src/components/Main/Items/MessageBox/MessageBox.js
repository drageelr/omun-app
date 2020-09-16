import React, { Component } from 'react';
import {Card, CardHeader,CardText} from 'reactstrap';
import './MessageBox.css'
import {connect} from 'react-redux'
import {newMessage} from './Actions'
import UserList from './Users/userList';

const mapStateToProps= (state) =>{
    return{
        message:state.MsgReducer.message
    }
}

const mapDispatchToProps =(dispatch) =>{
    return{
        onMessageSend:(e)=>{
            let payload;
            let country;
            if(e.target.id ==='Message'){
                payload=e.target.value
            }else if(e.target.id==='Country')
            {
                country=e.target.value
            }
            dispatch(newMessage(payload,country))

        },
    }
}

class MessageBox extends Component {
    render() { 
        const {message, onMessageSend,}=this.props;
        return ( 
        <div>
                <Card style={{height:'32vh',overflowY: "auto"}}>
                    <CardHeader>MessageBox</CardHeader>
                    <div id="container">

                        <aside id="sidebar">
                            <UserList/>
                        </aside>

                        <section id="main">

                            <section id="messages-list">
                            <CardText>{message.map((item,i)=>{return <p style={{margin:'auto', paddingRight:'5px'}} key={i}>{item}</p>})}</CardText>
                            </section>

                            <section id="new-message">

                            <input required id='Country' placeholder="Country"
                                    onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                    onMessageSend(e)
                                    }
                                }}
                            /> <label>Press Enter to Select Country</label><br></br>
                            <input required id="Message"  placeholder="Message"
                                    onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                    onMessageSend(e)
                                    }
                                }}
                            /> 
                            
                            <label>Press Enter to send</label>
                            </section>
                        </section>
                    </div>
                </Card>
                
        </div> 
        );
    }
}
 
export default connect(mapStateToProps,mapDispatchToProps)(MessageBox);