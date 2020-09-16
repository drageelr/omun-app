import React, {Component} from 'react'
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import {newlogin,rememberButton} from './Actions'
import './Login.css'




const mapDispatchToProps =(dispatch) =>{
    return{
        handleChange:(event)=>{
            dispatch(newlogin(event.target.value,event.target.id))
        },
        handleRemember:(event) =>{
            dispatch(rememberButton(event.target.checked))
        }
    }
}


class Login extends Component{
    render() {
        
        return (
            <form>
                <h3>Sign In</h3>
                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" id='email' onChange={this.props.handleChange}  />
                </div>

                <div className='form-group'>
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" id='password' onChange={this.props.handleChange}/>
                </div>

                <div className='form-group'>
                    <div className='custom-control custom-checkbox'>
                        <input onChange={this.props.handleRemember} type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-dark">Submit</button>

                <p className='forgot-password'>
                    <Link to='/ResetPassword'>Forget Password?</Link>
                </p>
            </form>
             
        );
    }
}

export default connect(null,mapDispatchToProps)(Login)