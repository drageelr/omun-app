import React, {useState, useEffect, Component} from 'react'
import CSVEditor from './csv/CSVEditor.js';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { ButtonGroup } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        margin: '50px',
      },
    },
  }));

function Create({user}){
    const classes = useStyles();
    let modes = ['admins', 'dias', 'committees', 'countries', 'delegates']
    const [cindex, setCIndex] = useState(0) // separateb files sessions
    const [files, setFiles] = useState({})

    return (
        <><h5 style={{ marginTop:'10px'}}>Create {modes[cindex][0].toUpperCase() + modes[cindex].substring(1)}</h5>
        <CSVEditor mode={modes[cindex]} files={files} setFiles={setFiles} style={{width:'50%'}}/>
        <br></br>
        <ButtonGroup fullWidth={true}>
            { 
                cindex == 0 
                ? <Button  href='/'> Back </Button>
                : <Button  onClick={() => setCIndex(cindex - 1)}> Back </Button>
            }
            { 
                cindex == 4
                ? <Button  onClick={() => setCIndex(0)} href='/'> Next </Button>
                : <Button  onClick={() => setCIndex(cindex + 1)}> Next </Button>
            }
        </ButtonGroup></>
    )

}
export default Create;
