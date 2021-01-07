import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function StatusSnackbar({status, handleSnackbarClose, severity}) {
  return (
    <Snackbar open={status !== ''} onClose={handleSnackbarClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} autoHideDuration={6000}>
      <Alert onClose={handleSnackbarClose} severity={severity}>
          {status}
      </Alert>
    </Snackbar>
  )
}