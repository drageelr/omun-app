import React from 'react'
import { Link } from "react-router-dom";
import { newlogin } from './Actions'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import { TextField } from 'formik-material-ui'
import {Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import './Login.css'


function Login({setIsLoggedIn, setUser}){
    const selectedBGStyle = {backgroundColor: "goldenrod", color:"white"}
    const normalBGStyle = {backgroundColor: "sienna", color:"white"}
    const [userType, setUserType] = React.useState("delegate")

    return (
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
            const user = await newlogin({email: values.email, password: values.password, userType:userType});
            setSubmitting(false);
            console.log("User logged in", user);
            setUser(user);
            setIsLoggedIn(true);
          }
        }

        >
        {({submitForm, isSubmitting})=> (
          
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
                    Dias
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

            <button type="submit" className="btn btn-primary btn-block btn-dark" style={{width:'80px',marginLeft:'36%'}}>Login</button>
          </Form>
        )}
      </Formik>
            
    );
}

export default Login