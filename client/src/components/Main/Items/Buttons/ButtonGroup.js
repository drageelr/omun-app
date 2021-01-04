import React, {useState, useEffect} from 'react'
import { Button } from '@material-ui/core'
import DescriptionIcon from '@material-ui/icons/Description'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function ButtonGroup({tempOnClick, fileButtonClick}) {

    return (
    <div  style={{marginTop:'2vh'}} className='Buttons'>
        <div>
            <Button variant="contained" color="primary" startIcon={<ExitToAppIcon/>} >Leave Session</Button>
            &nbsp;&nbsp;
            <Button onClick={fileButtonClick} variant="contained" color="grey.300" startIcon={<DescriptionIcon/>} >Files</Button>
            &nbsp;&nbsp;
            <Button onClick={tempOnClick} variant="contained" color="secondary">TEMP BUTTON</Button>
        </div>
    </div>
    )
}