import React, {useState, useEffect, Component} from 'react'
import CSVEditor from './CSVEditor.js';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { ButtonGroup } from '@material-ui/core';
import './Create.css'

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
    let modes = ['admins', 'countries', 'committees', 'dias', 'delegates']
    const [cindex, setCIndex] = useState(0) // separateb files sessions
    const [files, setFiles] = useState({})

    return (
      <div className="create-inner">
        <h5>Create {modes[cindex][0].toUpperCase() + modes[cindex].substring(1)}</h5>
        <CSVEditor mode={modes[cindex]} files={files} setFiles={setFiles} style={{width:'50%'}}/>
        <ButtonGroup fullWidth={true}>
            { cindex == 0 
              ? <Button  href='/'> Back </Button>
              : <Button  onClick={() => setCIndex(cindex - 1)}> Back </Button>
            }
            { cindex == 4
              ? <Button  onClick={() => setCIndex(0)} href='/'> Next </Button>
              : <Button  onClick={() => setCIndex(cindex + 1)}> Next </Button>
            }
        </ButtonGroup>
      </div>
    )

}
export default Create;
