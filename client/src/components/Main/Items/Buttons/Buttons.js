import React from 'react'
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DescriptionIcon from '@material-ui/icons/Description';

let plaqNotification;

const handleWindow=() =>{
    window.open('https://google.com')
}

function Buttons ({ seated,  unSit, raise, unraise , raised}) {     
    return(
        <div>
            <Button variant="contained" color="primary" startIcon={<ExitToAppIcon/>} onClick={handleWindow}>Leave Session</Button>
            &nbsp;&nbsp;
            <Button variant="contained" color="grey.300" startIcon={<DescriptionIcon/>} onClick={handleWindow}>Files</Button>
        
        </div>
    )
}
export default Buttons;