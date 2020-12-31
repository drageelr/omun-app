import React, {useState, useEffect} from 'react';
import './Zoom.css'
import { Paper, Tabs, Tab, Card, CardContent, List, ListItem, ListItemText} from '@material-ui/core';

function GSL({tempToList, placement}) {
    let [gsList, setGSList] = useState(["GSL1", "GSL2", "GSL3"]);

    // const toggle=(e)=>{
    //     (tempToList && tempToList.includes(e.target.id)) ? removeFromList(e.target.id) : addToList(e.target.id);
    // }
    
    // let occupied = placement && Object.values(placement).filter((item,i)=>{
    //     return item.empty === false 
    // })

    return(
        <List>
        {
            gsList && 
            gsList.map((item,i)=> (
                <ListItem key={i} dense>
                    <ListItemText primary={item} />
                </ListItem>
            ))
        }  
        </List>
        // <div>
        //     <ul>
        //         {   
        //             occupied &&
        //             occupied.map(function(item){
        //             const stylee=(tempToList && tempToList.includes(item.country))?'crossed' : 'not';
        //             return <p id={item.country} onClick={toggle} className={stylee}>{item.country}</p>
        //         })}
        //     </ul>
        // </div>
    )
}


function RSL({}) {
    let [rsList, setRSList] = useState(["RSL1", "RSL2"]);

    return(
        <List>
        {
            rsList && 
            rsList.map((item,i)=> (
                <ListItem key={i} dense>
                    <ListItemText primary={item} />
                </ListItem>
            ))
        }  
        </List>
    )
}

function Topics({}) {
    let [topics, setTopics] = useState(["T1", "T2"]);

    return(
        <List>
        {
            topics && 
            topics.map((item,i)=> (
                <ListItem key={i} dense>
                    <ListItemText primary={item} />
                </ListItem>
            ))
        }  
        </List>
    )
}

function Zoom() {
    const [tabValue, setTabValue] = React.useState(0);

    const handleChange = (e, newValue) => {
        setTabValue(newValue);
    };

    return (  
        <div>
            <Card style={{height:"48vh",overflowY:"hidden"}}>
                <Paper >
                    <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="Topics" />
                        <Tab label="GSL" />
                        <Tab label="RSL" />
                    </Tabs>
                </Paper>
                <CardContent>
                {
                    tabValue == 0 ?
                    <Topics/> :
                    tabValue == 1 ?
                    <GSL/> :
                    <RSL/>
                }                
                </CardContent>
            </Card>
        </div>
    );
}
 
export default Zoom;