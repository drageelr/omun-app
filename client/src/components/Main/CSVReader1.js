import React, { Component } from 'react'
import { CSVReader , jsonToCSV } from 'react-papaparse'
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import {send} from './Actions';

const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));
const buttonRef = React.createRef()


export default function CSVReader1 ({mode}) {

    const classes = useStyles();
    let toSend = [];
    let toDisplay = [];
    let toSave = [];
    let csv;
    let packet;
    var encodedUri;
    let up = 0;
    if (mode=='admin') toSave.push(['Ids','Names','Emails']);
    if (mode=='committee') toSave.push(['Ids','Names','Initials']);
    if (mode=='country') toSave.push(['Ids','Names','Initials','Veto']);
    if (mode=='dias') toSave.push(['Ids','Names','Email','Title','ComitteeId']);

const save = (e) =>{
    window.open(encodedUri);
    if (buttonRef.current) {
        buttonRef.current.removeFile(e)
      }
    }
  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  const handleOnFileLoad =(data) => {
    console.log('---------------------------')
    let packet;
    if (mode=='admin') {
        data.map((item,i)=>{ if (i!==0) {toSend.push([{'name' : item.data[0] , 'email' : item.data[1] }])}});
        data.map((item,i)=>{ if (i!==0) {
                            toDisplay.push([{'ids':`${i}`, 'name' : item.data[0] , 'email' : item.data[1] }]);
                            toSave.push([`${i}`,  item.data[0] ,  item.data[1] ])}});
            packet={'admins' : toSend};
            
    
    }
    if (mode=='committee'){
        data.map((item,i)=>{ if (i!==0) {toSend.push([{'name' : item.data[0] , 'initials' : item.data[1] }])}});
        data.map((item,i)=>{ if (i!==0) {
                            toDisplay.push([{'ids':`${i}`, 'name' : item.data[0] , 'initials' : item.data[1] }]);
                            toSave.push([`${i}`,  item.data[0] ,  item.data[1] ])}});
            packet={"committees" : toSend};
    }
    if (mode=='country'){
        data.map((item,i)=>{ if (i!==0) {toSend.push([{'name' : item.data[0] , 'initials' : item.data[1] , 'veto' :'0'}])}});
        data.map((item,i)=>{ if (i!==0) {
                            toDisplay.push([{'ids':`${i}`, 'name' : item.data[0] , 'initials' : item.data[1] , 'veto' :'0'}]);
                            toSave.push([`${i}`,  item.data[0] ,  item.data[1] , '0'])}});
            packet={"countries" : toSend};
    }
    if (mode=='dias') {
        data.map((item,i)=>{ if (i!==0) {toSend.push([{'name' : item.data[0] , 'email' : item.data[1], 'title' : item.data[2], 'comitteeId' : item.data[3] }])}});
        data.map((item,i)=>{ if (i!==0) {
                            toDisplay.push([{'ids':`${i}`, 'name' : item.data[0] , 'email' : item.data[1] , 'title' : item.data[2], 'comitteeId' : item.data[3]}]);
                            toSave.push([`${i}`,  item.data[0] ,  item.data[1] , item.data[2], item.data[3]])}});
            packet={"dias" : toSend};
    }
    if (mode=='delCr') {
        data.map((item,i)=>{ if (i!==0) {toSend.push([{'name' : item.data[0] , 'email' : item.data[1], 'title' : item.data[2], 'comitteeId' : item.data[3] ,'countryId' : item.data[4] }])}});
        data.map((item,i)=>{ if (i!==0) {
                            toDisplay.push([{'ids':`${i}`, 'name' : item.data[0] , 'email' : item.data[1] , 'title' : item.data[2], 'comitteeId' : item.data[3] ,'countryId' : item.data[4]}]);
                            toSave.push([`${i}`,  item.data[0] ,  item.data[1] , item.data[2], item.data[3] , item.data[4] ])}});
            packet={"delegates" : toSend};

    }
    const resp = send(packet,mode);
    csv = "data:text/csv;charset=utf-8," 
    + toSave.map(e => e.join(",")).join("\n");
    encodedUri = encodeURI(csv);

    console.log(toSend)
    console.log(csv)
    console.log('---------------------------')
  }

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  const handleOnRemoveFile = (data) => {
    console.log('---------------------------')
  }

  const handleRemoveFile = (e) =>  {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e)
    }
  }

    return (
      < div style={{width:'500px'}} >
        <CSVReader
          ref={buttonRef}
          onFileLoad={handleOnFileLoad}
          onError={handleOnError}
          noClick
          Drag
          onRemoveFile={handleOnRemoveFile}
        >
          {({ file }) => (
              <>
            <aside
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 10,
                width:'400px'

              }}
            >
                <Button
                    onClick={handleOpenDialog}
                    color="default"
                    className={classes.button}
                    startIcon={<CloudUploadIcon />}
                    size="small"    
                >
                    Upload
                </Button>
             
              <Button
                onClick={handleRemoveFile}
                color="secondary"
                size="small"
                className={classes.button}
                startIcon={<DeleteIcon />}
            >
                Remove
            </Button>
            <Button
                onClick={save}
                color="primary"
                size="small"
                className={classes.button}
                startIcon={<SaveIcon />}
            >
                Save
            </Button>
            <br></br>
            </aside>
            
            <div
              >
                {file && file.name}
              </div>
              </>
          )}
        </CSVReader>
      </div>
    )
}
