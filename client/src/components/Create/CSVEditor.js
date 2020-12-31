import React, { useState } from 'react'
import { CSVReader } from 'react-papaparse'
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import {send, fetch} from './Actions';
import { css } from "@emotion/core";
import FadeLoader from "react-spinners/FadeLoader";

const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));
const buttonRef = React.createRef()


function saveArrayCSV(csvArray, fname){
  const templateCSV = "data:text/csv;charset=utf-8," 
  + csvArray.map(e => e.join(",")).join("\n")

  let link = document.createElement("a")
  link.setAttribute("href", encodeURI(templateCSV))
  link.setAttribute("download", `${fname}.csv`)
  document.body.appendChild(link)
  link.click()
}

export default function CSVEditor ({mode,files,setFiles}) {
  const [loadc, setLoadc] = useState(false)
  const [status, setStatus] = useState('')
  const [displayData, setDisplayData] = useState([])

  const classes = useStyles();
  let toSave = [];
  let apiMode = {'admins': 'admin', 'countries': 'country', 'committees':'committee', 'delegates':'delegate', 'dias': 'dias'}

  if (mode==='admins') toSave.push(['id','name','email']);
  if (mode==='committees') toSave.push(['id','name','initials']);
  if (mode==='countries') toSave.push(['id','name','initials','veto','personality','imageName']);
  if (mode==='dias') toSave.push(['id','name','email','title','committeeId']);
  if (mode==='delegates') toSave.push(['id','name','email','committeeId', 'countryId']);

  async function callFetch() {
    try{
      const res = await fetch({attributes: toSave[0],accountType: apiMode[mode]});
      toSave = toSave.concat(res)
      setDisplayData(toSave);

    } 
    catch(e){
      console.error(e);
      setStatus(e); 
    }
  }

  React.useEffect(() => {
    setDisplayData(toSave);
    setStatus([]);
    setLoadc(false);
    callFetch()
    
  }, [mode]);

  const save = (e) => {
    saveArrayCSV(displayData, mode);
  }
  
  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  const handleOnFileLoad = async (data) => {
    setLoadc(true);
    let toSend = [];
    let newS = {...files};
    newS[mode]=data;
    setFiles(newS);
    let packet;
    
    const csvArray = data.slice(1) //without header

    if (mode==='admins') {
      csvArray.forEach((item,i)=>{ toSend.push({'name' : item.data[0] , 'email' : item.data[1] })});
    }
    else if (mode==='committees'){
      csvArray.forEach((item,i)=>{ toSend.push({'name' : item.data[0] , 'initials' : item.data[1] })});
    }
    else if (mode==='countries'){
      csvArray.forEach((item,i)=>{ toSend.push({'name' : item.data[0] , 'initials' : item.data[1] , 'veto' : item.data[2] === '1' ? true : false, 'personality' : item.data[3] === '1' ? true : false, 'imageName' : item.data[4]})});
    }
    else if (mode==='dias') {
      csvArray.forEach((item,i)=>{ toSend.push({'name' : item.data[0] , 'email' : item.data[1], 'title' : item.data[2], 'committeeId' : item.data[3] })});
    }
    else if (mode==='delegates') {
      csvArray.forEach((item,i)=>{ toSend.push({'name' : item.data[0] , 'email' : item.data[1], 'committeeId' : item.data[2] ,'countryId' : item.data[3] })});
    }

    packet={[mode]: toSend};

    let toSave = displayData.map(arr => arr.slice());
    csvArray.forEach((item,i)=> {
      let itemData = item.data;
      itemData.unshift(i);
      toSave.push(itemData);
    });
    
    
    try{
      const ids = await send(packet,apiMode[mode]);
      setStatus("Creation successful.");
      
      const prevElems = toSave.length-ids.length; //to append ids from that point onwards
      toSave.slice(prevElems).forEach((item, i) => { item[0] = ids[i]; })
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
        >
          {({ file }) => (
            <div>
              <div id="table-wrapper">
                <div id="table-scroll">
                  <table id="csvTable">
                    <thead>
                      <tr>
                        {displayData[0] && displayData[0].map((header, index) => {
                          return <th key={index}>{header}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {displayData.slice(1).map((row, i) => (
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
                </div>
              </div>
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
                    onClick={save}
                    color="primary"
                    size="small"
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

              {/* {file && <div> {file.name} </div> } */}

              { status !== '' && <div className="message"> {status} </div> }

            </div>
          )}
        </CSVReader>
      </div>
    )
}
