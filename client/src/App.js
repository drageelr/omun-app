import React from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login/login'
import ResetPassword from './components/Login/ResetPassword';
import MainScreen from './components/Main/MainScreen';
import './App.css';


function App() {
  return (
  <Router>
    <div className="App">
          <Switch>
            <Route exact path='/MainScreen' component={MainScreen}/>
            <div className="auth-wrapper">
              <div className="auth-inner">
              <Route exact path='/' component={Login} />
              <Route exact path='/ResetPassword' component={ResetPassword}/>
              </div>
            </div>
          </Switch>
    </div>
    </Router>
  );
}


export default App;
