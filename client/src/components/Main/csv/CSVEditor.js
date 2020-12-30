import React, { useState } from 'react'
import { CSVReader } from 'react-papaparse'
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import {send} from '../Actions';
import { css } from "@emotion/core";
import FadeLoader from "react-spinners/FadeLoader";
import './CSVEditor.css'

const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));
const buttonRef = React.createRef()


export default function CSVEditor ({mode,files,setFiles}) {
  const [saveb, setSaveb] = useState(false)
  const [removeb, setRemoveb] = useState(false)
  const [loadc, setLoadc] = useState(false)
  const [status, setStatus] = useState('')
  const [displayData, setDisplayData] = useState([])

  const classes = useStyles();
  let toSend = [];
  let toSave = [];
  let headers = [];
  let csv;
  let apiMode = {'admins': 'admin', 'countries': 'country', 'committees':'committee', 'delegates':'delegate', 'dias': 'dias'}
  var encodedUri;


  if (mode==='admins') headers = (['id','name','email']);
  if (mode==='committees') headers = (['id','name','initials']);
  if (mode==='countries') headers = (['id','name','initials','veto']);
  if (mode==='dias') headers = (['id','name','email','title','comitteeId']);
  if (mode==='delegates') headers = (['id','name','email','title','comitteeId', 'countryId']);

  React.useEffect(() => {
    setDisplayData([]);
    setStatus([]);
    setSaveb(false);
    setRemoveb(false);
    setLoadc(false);
  }, [mode]);

  const save = (e) =>{
    csv = "data:text/csv;charset=utf-8," + toSave.map(e => e.join(",")).join("\n");
    encodedUri = encodeURI(csv);
    setSaveb(true);
    console.log(csv)
    window.open(encodedUri);
  }
  
  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  const handleOnFileLoad = async (data) => {
    let newS = {...files};
    newS[mode]=data;
    setFiles(newS);
    console.log('---------------------------')
    let packet;

    if (mode==='admins') {
      data.forEach((item,i)=>{ if (i!==0) {toSend.push({'name' : item.data[0] , 'email' : item.data[1] })}});
    }
    else if (mode==='committees'){
      data.forEach((item,i)=>{ if (i!==0) {toSend.push({'name' : item.data[0] , 'initials' : item.data[1] })}});
    }
    else if (mode==='countries'){
      console.log(data);
      data.forEach((item,i)=>{ if (i!==0) {toSend.push({'name' : item.data[0] , 'initials' : item.data[1] , 'veto' : data[2] === 1 ? true : false})}});
    }
    else if (mode==='dias') {
      data.forEach((item,i)=>{ if (i!==0) {toSend.push({'name' : item.data[0] , 'email' : item.data[1], 'title' : item.data[2], 'comitteeId' : item.data[3] })}});
    }
    else if (mode==='delegates') {
      data.forEach((item,i)=>{ if (i!==0) {toSend.push({'name' : item.data[0] , 'email' : item.data[1], 'title' : item.data[2], 'comitteeId' : item.data[3] ,'countryId' : item.data[4] })}});
    }

    packet={[mode]: toSend};

    data.forEach((item,i)=> {
      if (i!==0) {
        let itemData = item.data;
        itemData.unshift(i);
        toSave.push(itemData);
      }
    });

    console.log(toSave);
    setDisplayData(toSave);

    setRemoveb(true);
    
    setLoadc(true);
    
    try{
      const ids = await send(packet,apiMode[mode]);
      setStatus("Creation successful.");

      toSave.forEach((item, i) => { item[0] = ids[i]; })
      setDisplayData(toSave);
    } 
    catch(e){
      console.error(e);
      setStatus(e); 
    }
    
    setLoadc(false);
  }

  const handleOnError = (err, file, inputElem, reason) => {
    alert(err)
  }

  const handleOnRemoveFile = (data) => {
    let newS = {...files};
    delete newS[mode];
    setFiles(newS);
    setRemoveb(false);
    setSaveb(false);
    setDisplayData([]);
  }

  const handleRemoveFile = (e) =>  {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e)
    }
  }

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: grey;
  `;

    return (
      <div>
        <CSVReader
          ref={buttonRef}
          onFileLoad={handleOnFileLoad}
          onError={handleOnError}
          noClick
          Drag
          onRemoveFile={handleOnRemoveFile}
        >
          {({ file }) => (
            <div>
                <table id="csvTable">
                  <thead>
                    <tr>
                      {headers.map((header, index) => {
                        return <th key={index}>{header}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((row, i) => (
                      <tr key={i}>
                        {
                          row.map((item, j) =>  (
                            <td key={j}>{item}</td>
                          ))
                        }
                      </tr>
                    ))}
                  </tbody>
              </table>
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
                > Upload
                </Button>
            
                <Button
                  onClick={handleRemoveFile}
                  color="secondary"
                  size="small"
                  disabled={!removeb}
                  className={classes.button}
                  startIcon={<DeleteIcon />}
                > Remove
                </Button>
                
                <Button
                    onClick={save}
                    color="primary"
                    size="small"
                    disabled={!saveb}
                    className={classes.button}
                    startIcon={<SaveIcon />}
                > Save
                </Button>
                
                <br></br>
              </aside>

              <FadeLoader
                css={override}
                height={13}
                width={2}
                radius={10}
                margin={1}
                color={"red"}
                loading={loadc}
              />

              {file && <div> {file.name} </div> }

              { status !== '' && <div className="message"> {status} </div> }

            </div>
          )}
        </CSVReader>
      </div>
    )
}
