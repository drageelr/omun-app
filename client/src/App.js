import React, {useState} from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login/Login'
import ChangePassword from './components/Login/ChangePassword'
import MainScreen from './components/Main/MainScreen';
import Home from './components/Main/Home';
import Create from './components/Create/Create';
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


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  return (      
    <Router>
      <ThemeProvider theme={appTheme}>
        <div className="App">
          <div className="auth-wrapper">
              <Switch>
                <Route exact path='/main' component={()=><MainScreen/>}/>
                  <Route exact path='/' component={ 
                    isLoggedIn ?                           
                    () => <Home user={user} />
                    : () => <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
                  }/>
                  <Route exact path='/Create' component={Create}/>
                  <Route exact path='/ChangePassword' component={ChangePassword}/>
              </Switch>
          </div>
        </div>
      </ThemeProvider>
    </Router>
  );
}


export default App;
