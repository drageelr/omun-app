import React, {useState, useEffect, Component} from 'react'
import CSVReader from './CSVReader.js';
import CSVReader1 from './CSVReader1.js';
import CSVReader2 from './CSVReader2.js';
import CSVReader3 from './CSVReader3.js';
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
    const [crea, setCrea] = useState(0) // separateb files sessions
    const [files, setFiles] = useState({})
    //localStorage.token

    switch (crea) {
        case 0:
            return <><h5 style={{ marginTop:'10px'}}>Create Admins</h5><CSVReader mode='admin' files={files} setFiles={setFiles} style={{width:'50px'}}/>
            <br></br>
            <ButtonGroup fullWidth={true}>
                <Button  href='/'> Back </Button>
                <Button  onClick={() => setCrea(crea + 1)}> Next </Button>
            </ButtonGroup></>
        case 1:
            return<><h5 style={{ marginTop:'10px'}}>Create Dias</h5><CSVReader1 mode='dias'files={files} setFiles={setFiles}  /><br></br>
            <ButtonGroup fullWidth={true}>
                <Button  onClick={() => setCrea(crea - 1)}> Back </Button>
                <Button  onClick={() => setCrea(crea + 1)}> Next </Button>
            </ButtonGroup></>
        case 2: 
            return<><h5 style={{ marginTop:'10px'}}>Create Committees</h5><CSVReader2 files={files} setFiles={setFiles}  mode='committee'/><br></br>
            <ButtonGroup fullWidth={true}>
                <Button  onClick={() => setCrea(crea - 1)}> Back </Button>
                <Button  onClick={() => setCrea(crea + 1)}> Next </Button>
            </ButtonGroup></>
        case 3: 
            return<><h5 style={{ marginTop:'10px'}}>Create Countries</h5><CSVReader3 files={files} setFiles={setFiles} mode='contry'/><br></br>
            <ButtonGroup fullWidth={true}>
                <Button  onClick={() => setCrea(crea - 1)}> Back </Button>
                <Button  onClick={() => setCrea(crea + 1)}> Next </Button>
            </ButtonGroup></>
        case 4:
            return<><h5 style={{ marginTop:'10px'}}>Create Delegates</h5><CSVReader1 files={files} setFiles={setFiles} mode='delegate'/><br></br>
            <ButtonGroup fullWidth={true}>
                <Button  onClick={() => setCrea(crea - 1)}> Back </Button>
                <Button  onClick={() => setCrea(0)} href='/main'> Next </Button>
            </ButtonGroup></>
        default:
            break;
    }

}
export default Create;
