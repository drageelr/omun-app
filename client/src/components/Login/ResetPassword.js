import React from 'react'
import './Login.css'

function ResetPassword(){
    return(
        <form>
            <h3>Reset Password</h3>
            <div className="form-group">
                <label>Email Address</label>
                <input type='email' className='form-control' placeholder="Enter email"/>
            </div>

            <div>
                <button type="submit" className="btn btn-primary btn-block btn-dark">Reset</button>
                <p className="forgot-password text-right"></p>
            </div>
        </form>
    )
}

export default ResetPassword