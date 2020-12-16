import React, {useState, useEffect} from 'react'
import $ from 'jquery'


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
    //localStorage.token
    return(
        <div className='parent'>
          Welcome {user.name}!
        </div>
    )
    
}

export default Home