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

function Login({setIsLoggedIn, setUser}){
    const selectedBGStyle = {backgroundColor: '#aa2e25', color: 'white'}
    const normalBGStyle = {backgroundColor: '#f44336', color:"white"}
    const [userType, setUserType] = React.useState("delegate")
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: grey;
`;
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

        onSubmit={ async (values, { setSubmitting, setStatus, setErrors }) => {
            console.log(values);
            try {
              const user = await newlogin({email: values.email, password: values.password, userType:userType});
              console.log("User logged in", user);
              setUser(user);
              setIsLoggedIn(true);  
            } catch (e) { // login fails
              console.error(e);
              setStatus({message: e});
            }
            setSubmitting(false);
          }
        }

        >
        {({isSubmitting, status})=> (
          
          <Form style={{textAlign:'center'}}>
    
            <h3>Sign In</h3>

            <div className="form-group" >
              <ToggleButtonGroup size="medium" value={userType} exclusive>
                <ToggleButton 
                value="delegate" 
                onClick={()=>setUserType("delegate")}
                style={userType==="delegate" ? selectedBGStyle : normalBGStyle}>
                    Delegate
                </ToggleButton>,
                <ToggleButton
                value="dias" 
                onClick={()=>setUserType("dias")} 
                style={userType==="dias" ? selectedBGStyle : normalBGStyle}>
                    Dais
                </ToggleButton>,
                <ToggleButton
                value="admin" 
                onClick={()=>setUserType("admin")} 
                style={userType==="admin" ? selectedBGStyle : normalBGStyle}>
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
            <Button type="submit" color="primary">
              <MoonLoader
                  css={override}
                  size={15}
                  loading={isSubmitting}
                /> Login</Button>

            {status && status.message && (
              <div className="message">{status.message}</div>
            )}
          </Form>
        )}
      </Formik>
      </div>
    );
}

export default Login