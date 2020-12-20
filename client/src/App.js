import React, {useState} from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login/Login'
import ResetPassword from './components/Login/ResetPassword';
import MainScreen from './components/Main/MainScreen';
import Home from './components/Main/Home';
import './App.css';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState({})
  console.log(user);
  return (
    <Router>
      <div className="App">
            <Switch>
              <Route exact path='/main' component={MainScreen}/>
              <div className="auth-wrapper">
                <div className="auth-inner">
                <Route exact path='/' component={ 
                  isLoggedIn ?                           //change later to not
                  () => <Home user={user} /> : 
                  () => <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser}/>
                }/>
                </div>
              </div>
            </Switch>
      </div>
    </Router>
  );
}


export default App;
