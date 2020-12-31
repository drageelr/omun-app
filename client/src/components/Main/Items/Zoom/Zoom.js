import React,{Component} from 'react';
import './Zoom.css'
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import {Card, CardBody, CardHeader, CardImg,} from 'reactstrap';
import logo from './logo/lumun-logo.png'
import 'react-web-tabs/dist/react-web-tabs.css';
import Gsl from './Gsl';

function Zoom() {
    return (  
        <div>
            <Card style={{height:"48vh",overflowY:"hidden"}}>
                <CardBody>
                <Tabs
                    defaultTab="two"
                    onChange={(tabId) => { console.log(tabId) }}
                >
                    <TabList>
                    <Tab tabFor="one">Topics</Tab>
                    <Tab tabFor="two">GSL</Tab>
                    <Tab tabFor="three">RSL</Tab>
                    </TabList>
                    <TabPanel tabId="one">
                    <p>Tab 1 content</p>
                    </TabPanel>
                    <TabPanel tabId="two">
                        <Gsl></Gsl>
                    </TabPanel>
                    <TabPanel tabId="three">
                    <p>Tab 3 content</p>
                    </TabPanel>
                </Tabs>
                        {/* <CardImg className="Image" src={logo} alt = 'Logo'/> */}
                </CardBody>
            </Card>
        </div>
    );
}
 
export default Zoom;