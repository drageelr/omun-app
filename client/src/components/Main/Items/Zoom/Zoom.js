import React from 'react';
import './Zoom.css'
import GSL from './GSL';
import { Paper, Tabs, Tab, Card, CardContent} from '@material-ui/core';

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
                    <div>Topics</div> :
                    tabValue == 1 ?
                    <GSL/> :
                    <div>RSL</div>
                }                
                </CardContent>
            </Card>
        </div>
    );
}
 
export default Zoom;