import React, {useState, useEffect, Component} from 'react'
import $ from 'jquery'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CSVReader1 from './CSVReader1.js';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
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
    //localStorage.token
    // if (user === 'admin')
    return(
        <>
        <h5 style={{ marginTop:'10px'}}>Create Admins</h5>
            <CSVReader1 mode='adminCr'/>
        <h5>Create Dias</h5>
        <CSVReader1 mode='diasCr'/>
        <h5>Create Committees</h5>
            <CSVReader1 mode='commiCr'/>
            <h5>Create Countries</h5>
            <CSVReader1 mode='contiCr'/>
            <h5>Create Delegates</h5>
            <CSVReader1 mode='delCr'/>
            <Button style={{marginLeft:'20vw', marginTop:'10px', marginBottom:'0px'}}>Next</Button>
        </>
    );
    
    // else if (user==='dias')
    // return(
        
    //     <div className='parent' style={{height:'70vh', backgroundColor:'white' , backgroundImage:'url()'}}>
    //       dias {user.name}!
    //     </div>
    // );

    // else if (user==='delegate')
    // return(
        
    //     <div className='parent' style={{height:'70vh', backgroundColor:'white' , backgroundImage:'url()'}}>
    //       delegate {user.name}!
    //     </div>
    // );
    // else 
    // return(
        
    //     <div className='parent' style={{height:'70vh', backgroundColor:'white' , backgroundImage:'url()'}}>
    //       welcome {user.name}!
    //     </div>
    // );
    
}

export default Home