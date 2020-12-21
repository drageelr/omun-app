import React, {useState, useEffect, Component} from 'react'
import $ from 'jquery'
import CSVReader1 from './CSVReader1.js';
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
function saveArrayCSV(csvArray, fname){
    const templateCSV = "data:text/csv;charset=utf-8," 
    + csvArray.map(e => e.join(",")).join("\n")

    let link = document.createElement("a")
    link.setAttribute("href", encodeURI(templateCSV))
    link.setAttribute("download", `${fname}.csv`)
    document.body.appendChild(link)
    link.click()
}

function handleElementsUpload(e) {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = (e) => {
        const data = $.csv.toArrays(e.target.result)
        if(data !== null && data !== "" && data.length > 1) { 
            data.shift() //removed header
            const elements = data.map(row => ({
                name: row[0], 
                abv: row[1],
                type: row[2]
            })
            )
            
            const newElements = elements.map((element, index) => ({
                ...element,
                elementId: "" //temporary for display
            }))

        }
        else{
            //error on validating
            console.log("Error validating the import.")
        }
    }
}

function Home({user}){
    const classes = useStyles();
    const [crea, setCrea] = useState(0)
    //localStorage.token
    if (user.Type === 'admin')
    {
        switch (crea) {
            case 0:
                return <><h5 style={{ marginTop:'10px'}}>Create Admins</h5><CSVReader1 mode='admin'/>
                <ButtonGroup fullWidth={true}>
                    <Button  href='/'> Back </Button>
                    <Button  onClick={() => setCrea(crea + 1)}> Next </Button>
                </ButtonGroup></>
            case 1:
                return<><h5 style={{ marginTop:'10px'}}>Create Dias</h5><CSVReader1 mode='dias'/>
                <ButtonGroup fullWidth={true}>
                    <Button  onClick={() => setCrea(crea - 1)}> Back </Button>
                    <Button  onClick={() => setCrea(crea + 1)}> Next </Button>
                </ButtonGroup></>
            case 2: 
                return<><h5 style={{ marginTop:'10px'}}>Create Committees</h5><CSVReader1 mode='committee'/>
                <ButtonGroup fullWidth={true}>
                    <Button  onClick={() => setCrea(crea - 1)}> Back </Button>
                    <Button  onClick={() => setCrea(crea + 1)}> Next </Button>
                </ButtonGroup></>
            case 3: 
                return<><h5 style={{ marginTop:'10px'}}>Create Countries</h5><CSVReader1 mode='contry'/>
                <ButtonGroup fullWidth={true}>
                    <Button  onClick={() => setCrea(crea - 1)}> Back </Button>
                    <Button  onClick={() => setCrea(crea + 1)}> Next </Button>
                </ButtonGroup></>
            case 4:
                return<><h5 style={{ marginTop:'10px'}}>Create Delegates</h5><CSVReader1 mode='delegate'/>
                <ButtonGroup fullWidth={true}>
                    <Button  onClick={() => setCrea(crea - 1)}> Back </Button>
                    <Button  onClick={() => setCrea(0)} href='/main'> Next </Button>
                </ButtonGroup></>
            default:
                break;
        }

    }
    
    else if (user.Type==='dias')
    return(
        
        <div className='parent' style={{height:'70vh', backgroundColor:'white' , backgroundImage:'url()'}}>
          dias {user.name}!
        </div>
    );

    else if (user.Type==='delegate')
    return(
        
        <div className='parent' style={{height:'70vh', backgroundColor:'white' , backgroundImage:'url()'}}>
          delegate {user.name}!
        </div>
    );
    else 
    return(
        
        <div className='parent' style={{height:'70vh', backgroundColor:'white' , backgroundImage:'url()'}}>
          welcome {user.name}!
        </div>
    );
    
}

export default Home