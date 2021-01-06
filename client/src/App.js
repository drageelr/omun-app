import React, {useState} from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login/Login'
import ChangePassword from './components/Login/ChangePassword'
import MainScreen from './components/Main/MainScreen';
import Home from './components/Main/Home';
import Create from './components/Create/Create';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'

const appTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#aa2e25',
    },
    secondary: {
      main: '#ffcf33',
    },
  }
})


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
//   const [status, setStatus] = useState('');
//   const [severity, setSeverity] = useState('error');

//   function handleSnackbarClose() {
//     setStatus('');
//   }

  return (      
    <Router>
      <ThemeProvider theme={appTheme}>
        <div className="App">
          <div className="auth-wrapper">
              <Switch>
                <Route exact path='/main' component={()=><MainScreen /*setStatus={setStatus} setSeverity={setSeverity}*//>}/>
                  <Route exact path='/' component={ 
                    isLoggedIn ?                           
                    () => <Home user={user} /*setStatus={setStatus} setSeverity={setSeverity}*/ />
                    : () => <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} /*setStatus={setStatus} setSeverity={setSeverity}*//>
                  }/>
                  <Route exact path='/Create' component={Create}/>
                  <Route exact path='/ChangePassword' component={ChangePassword}/>
              </Switch>
          </div>
          {/* <Snackbar open={status !== ''} onClose={handleSnackbarClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} autoHideDuration={6000}>
            <Alert onClose={handleSnackbarClose} severity={severity}>
                {status}
            </Alert>
          </Snackbar> */}
        </div>
      </ThemeProvider>
    </Router>
  );
}


export default App;
