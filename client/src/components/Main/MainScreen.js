import React, {Component} from 'react'
import './MainScreen.css'
import InformationBar from './Items/InfoBar/InformationBar'
import Buttons from './Items/Buttons/Buttons'
import Zoom from './Items/Zoom/Zoom'
import Notification from './Items/Notification/Notification'
import VirtualAud from './Items/VirtualAud/VirtualAud'
import MessageBox from './Items/MessageBox/MessageBox'
class MainScreen extends Component{
    render(){
        return(
            <div className='parent'>
                <div className= 'Information-Bar'><InformationBar/>
                    <div style={{marginTop:'2vh'}} className='Zoom'><Zoom/>
                        <div  style={{marginTop:'2vh'}} className='Buttons'><Buttons/></div>
                    </div>
                </div>
                <div className='Notifications'><Notification/>
                    <div style={{marginTop:'2vh'}} className='Virtual-Aud'><VirtualAud/>
                        <div style={{marginTop:'2vh'}} className='MessageBox'><MessageBox/></div>
                    </div>
                </div>
                
                
            </div>
            
        )
    }
}

export default MainScreen