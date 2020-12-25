import React, {useState} from 'react'
import $ from 'jquery'
import Button from '@material-ui/core/Button';

function Home({user}){
    //localStorage.token
    if (user.Type === 'admin')
    {
        return( 
            <div style={{textAlign:'center'}}>
                <h3>Admin Portal</h3>
                <Button color="primary" href="/join">Join Session</Button>
                <br/>
                <Button color="primary" href="/Create">Create Entries</Button>
                <br/>
                <Button color="primary" href="/ChangePassword">Change Password</Button>
                <br/>
            </div>
        )
    }
    
    else if (user.Type==='dias')
    return( 
        <div style={{textAlign:'center'}}>
            <h3>Dias Portal</h3>
            <Button color="primary" href="/join">Join Session</Button>
            <br/>
            <Button color="primary" href="/ChangePassword">Change Password</Button>
            <br/>
        </div>
    )

    else if (user.Type==='delegate')
    return( 
        <div style={{textAlign:'center'}}>
            <h3>Delegate Portal</h3>
            <Button color="primary" href="/join">Join Session</Button>
            <br/>
            <Button color="primary" href="/ChangePassword">Change Password</Button>
            <br/>
        </div>
    );
}

export default Home

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
