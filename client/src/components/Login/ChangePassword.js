import React , {useState} from 'react'
import './Login.css'
import { changePassword } from './Actions'
import Button from '@material-ui/core/Button';
import { ButtonGroup } from '@material-ui/core';
import { TextField } from 'formik-material-ui'
import {Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import { css } from "@emotion/core";
import FadeLoader from "react-spinners/FadeLoader";

function ChangePassword(){
    const [isSubmitting , setSubmitting ] = useState(false);
    const override = css`
        display: block;
        margin: 0 auto;
        border-color: grey;
        `;
    if (!isSubmitting) {
    return(
        <div className="auth-inner">
            <Formik
            validateOnChange={false} validateOnBlur={true}
            
            initialValues = {{
                old_pass: '',
                new_pass: '',
            }}
            
            validationSchema={Yup.object({
                old_pass: Yup.string()
                  .required('Required'),
                new_pass: Yup.string()
                  .required('Required')
            })}

            onSubmit={ async (values, {setStatus, setSubmitting}) => {
                console.log(values);
                try {
                  await changePassword({oldPassword: values.old_pass, newPassword: values.new_pass});
                  setStatus({message: "Password changed successfully."});
                }
                catch(e) {
                  console.error(e);
                  setStatus({message: e});
                }
                setSubmitting(false);
              }
            }

            >
            {({isSubmitting, status})=> (
              
              <Form style={{textAlign:'center'}}>
        
                <h3>Reset Password</h3>

                <div className="form-group">
                    <Field
                      style = {{backgroundColor: 'white'}}
                      component={TextField}
                      variant="filled"
                      margin="normal"
                      required
                      label="Old Password"
                      name="old_pass"
                      type="password"
                    ></Field>
                </div>

                <div className='form-group'>
                    <Field
                      style = {{backgroundColor: 'white'}}
                      component={TextField}
                      variant="filled"
                      margin="normal"
                      required
                      label="New Password"
                      name="new_pass"
                      type="password"
                    > 
                    </Field>
                </div>
                <FadeLoader
                  css={override}
                  height={13}
                  width={2}
                  radius={10}
                  color={"red"}
                  loading={isSubmitting}
                />

                <ButtonGroup fullWidth={true} style={{marginTop:'20px'}}>
                    <Button  href="/" > Back </Button>
                    <Button type="submit"> Reset </Button>
                </ButtonGroup>
                <br></br>
                {status && status.message && (
                  <div className="message">{status.message}</div>
                )}
              </Form>
            )}
          </Formik>
        </div>
    )}
    else {
        return(
            <div style={{textAlign:'center'}}>
                <h3>Password Reset Request made</h3>
                <h6>You will be notified through email</h6>
                <Button  href="/" > Back </Button>
            </div>
        )
    }
}

export default ChangePassword