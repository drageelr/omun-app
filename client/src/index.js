import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import { createStore, applyMiddleware , combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {infoBar} from './Reducers/infoBar';
import { virAud } from './Reducers/virAud';
import {notifReducer} from './Reducers/notif'
import {MsgReducer} from './Reducers/messageReducer'
import {loginReducer} from './Reducers/loginReducer'

const logger = createLogger();
const rootReducer = combineReducers({infoBar:infoBar, virAud:virAud, notifReducer:notifReducer, MsgReducer:MsgReducer, loginReducer:loginReducer});

const store = createStore(rootReducer,applyMiddleware(logger,thunkMiddleware));
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
