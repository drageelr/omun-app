import React from 'react'
import { Link } from "react-router-dom";
import { newlogin } from './Actions'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import { TextField } from 'formik-material-ui'
import {Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import './Login.css'


function Login(){
    const selectedBGStyle = {backgroundColor: "goldenrod", color:"white"}
    const normalBGStyle = {backgroundColor: "sienna", color:"white"}
    const [userType, setUserType] = React.useState("Delegate")

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
            const user = await newlogin({email: values.email, password: values.password, userType: userType});
            setSubmitting(false);
            console.log("User logged in", user);
          }
        }

        >
        {({submitForm, isSubmitting})=> (
          
          <Form>
    
            <h3>Sign In</h3>

            <div className="form-group">
                <ToggleButtonGroup size="medium" value={userType} exclusive>
                <ToggleButton 
                value="Delegate" 
                onClick={()=>setUserType("Delegate")}
                style={userType==="Delegate" ? selectedBGStyle : normalBGStyle}>
                    Delegate
                </ToggleButton>,
                <ToggleButton
                value="Dias" 
                onClick={()=>setUserType("Dias")} 
                style={userType==="Dias" ? selectedBGStyle : normalBGStyle}>
                    Dias
                </ToggleButton>,
                <ToggleButton
                value="Admin" 
                onClick={()=>setUserType("Admin")} 
                style={userType==="Admin" ? selectedBGStyle : normalBGStyle}>
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

            <button type="submit" className="btn btn-primary btn-block btn-dark">Login</button>
          </Form>
        )}
      </Formik>
            
    );
}

export default Login