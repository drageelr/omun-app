import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Card, CardContent, ButtonGroup, IconButton, Typography  } from '@material-ui/core';
import * as Yup from 'yup'
import SendIcon from '@material-ui/icons/Send';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';


export default function TimeInputDialog({title, submitFunc, handleClose, open}) {
  return <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">{title}</DialogTitle>
    <DialogContent style={{marginTop: -20}}>
      <Formik 
          validateOnChange={false} validateOnBlur={true}
          initialValues={{ timeMinute: '', timeSecond: ''}}
          validationSchema={Yup.object({
            timeMinute: Yup.number().min(0).max(99),
            timeSecond: Yup.number().min(0).max(99),
          })}
          onSubmit={(values, {setSubmitting}) => {
              const totalTime = Number(values.timeMinute)*60+Number(values.timeSecond);
              submitFunc(totalTime);
              setSubmitting(false);
          }}
      >
        {({ submitForm}) => (
        <Form>
            <Field component={TextField} required variant="outlined" name="timeMinute" label={`Min`} style={{width: '70px'}} />
            
            <Field component={TextField} required variant="outlined" name="timeSecond" label={`Sec`} style={{width: '70px'}}/>
            
            <Button style={{marginTop: 10, float: 'right', marginBottom: 10, marginLeft: 5,}} alignRight 
            variant="contained"  endIcon={<SendIcon fontSize="small"/>}  color="primary"  onClick={submitForm} size="small" type="submit"
            >Set</Button>
        </Form>
        )}
      </Formik>
    </DialogContent>
  </Dialog>
}