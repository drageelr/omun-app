import React , {useState} from 'react'
import { Link } from "react-router-dom";
import { newlogin } from './Actions'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import { TextField } from 'formik-material-ui'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import './Login.css'
import { css } from "@emotion/core";
import MoonLoader from "react-spinners/MoonLoader";
import Button from '@material-ui/core/Button';
import logo from './logo.png';
import StatusSnackbar from '../Main/Items/StatusSnackbar'

function Login({setIsLoggedIn, setUser}){
    const selBGStyle = {backgroundColor: '#aa2e25', color: 'white'}
    const normalBGStyle = {backgroundColor: '#f06956', color:"white"}
    const [userType, setUserType] = useState("delegate");
    const [status, setStatus] = useState('');
    const [severity, setSeverity] = useState('error');
  
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: grey;
    `;


    function handleSnackbarClose() {
      setStatus('');
    }
    

    return (
      <div className="auth-inner">
        <Formik
        validateOnChange={false} validateOnBlur={true}
        
        initialValues = {{
            email: '',
            password: '',
        }}
        
        validationSchema={Yup.object({
            email: Yup.string()
              .email('Invalid Email Address')
              .required('Required'),
            password: Yup.string()
              .required('Required')
        })}

        onSubmit={ async (values, { setSubmitting }) => {
            console.log(values);
            try {
              const user = await newlogin({email: values.email, password: values.password, userType:userType});
              setUser(user);
              setIsLoggedIn(true);
              setSeverity('success');
              setStatus('Login successful.');  
            } catch (e) { // login fails
              setSeverity('error');
              setStatus(e);
            }
            setSubmitting(false);
          }
        }

        >
        {({isSubmitting})=> (
          
          <Form style={{textAlign:'center'}}>
            <img style={{width: '10vw', height: '10vw', alignSelf: 'center', margin: 0}} src={logo} alt="OMUN"/>
            <h3>Sign In</h3>

            <div className="form-group" >
              <ToggleButtonGroup size="medium" value={userType} exclusive>
                <ToggleButton 
                value="delegate" 
                onClick={()=>setUserType("delegate")}
                style={userType==="delegate" ? selBGStyle : normalBGStyle}>
                    Delegate
                </ToggleButton>,
                <ToggleButton
                value="dias" 
                onClick={()=>setUserType("dias")} 
                style={userType==="dias" ? selBGStyle : normalBGStyle}>
                    Dais
                </ToggleButton>,
                <ToggleButton
                value="admin" 
                onClick={()=>setUserType("admin")} 
                style={userType==="admin" ? selBGStyle : normalBGStyle}>
                    Admin
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

            <div className="form-group">
              <Field
                style = {{backgroundColor: 'white'}}
                component={TextField}
                variant="filled"
                margin="normal"
                required
                label="Email"
                name="email"
              ></Field>
            </div>

            <div className='form-group'>
              <Field
                style = {{backgroundColor: 'white'}}
                component={TextField}
                variant="filled"
                margin="normal"
                required
                label="Password"
                name="password"
                type="password"
              > 
              </Field>
            </div>
            <Button type="submit" color="primary" variant='contained'>
              <MoonLoader css={override} size={15} loading={isSubmitting} />
              Login
            </Button>
          </Form>
        )}
      </Formik>
      <StatusSnackbar status={status} severity={severity} handleSnackbarClose={handleSnackbarClose}></StatusSnackbar>
      </div>
    );
}

export default Login