import React, { useState, useEffect } from 'react';
import {Alert, Card, CardHeader,CardText} from 'reactstrap';
import './MessageBox.css'
import UserList from './UserList';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      height: 224,
    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
  }));
  
  export default function VerticalTabs() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
          style={{width:'220px'}}
        >
            {["Pakistan" , "India" , "Bangladesh" , "Iran" , "China"].map((item,i)=>{
                return <Tab label={item} {...a11yProps(i)}  />
            })}
          {/* <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
          <Tab label="Item Four" {...a11yProps(3)} />
          <Tab label="Item Five" {...a11yProps(4)} />
          <Tab label="Item Six" {...a11yProps(5)} />
          <Tab label="Item Seven" {...a11yProps(6)} /> */}
        </Tabs>
        {["Pakistan" , "India" , "Bangladesh" , "Iran" , "China"].map((item,i)=>{
                return ( <TabPanel value={value} index={i}>
                    <form className={classes.root} noValidate autoComplete="off" action={`/${item}`} style={{height:'10px' , position:'fixed' , bottom:'110px'}}>
                    <TextField id="outlined-basic" label="Message" variant="outlined" style={{width:'430px'}} />
                    <Button variant="outlined" color="primary" style={{height:'55px', marginLeft:'15px'}} onClick={() => { alert(`${item} `) }} >Send</Button>
                    </form>
                    </TabPanel>
                    )
            })}
        {/* <TabPanel value={value} index={0}>
        <form className={classes.root} noValidate autoComplete="off">
            <TextField id="standard-basic" label="Standard" />
        </form>
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel> */}
      </div>
    );

}

// function MessageBox({message, onMessageSend,tempToList}) {

//     const press=(e)=>{
//         if(tempToList.length===0){
//             alert('Please select countrie(s) to send message to');
//         }
//         else {
//             let message = e.target.value;
//             e.target.value='';
//             onMessageSend(`\"${message}\" -> ${tempToList.toString()}`);
//         }
//     }

//     return ( 
//         <div>
//             <Card style={{height:'32vh',overflowY: "hidden"}} className={'whole'}>
//                 <CardHeader id="head">Chits</CardHeader>
                
//                 <div id="container">

//                     <aside id="sidebar" >
//                         <UserList/>
//                     </aside>

//                     <section id="main">

//                         <section id="messages-list" >
//                         {message && 
//                             message.map((item,i)=>{
//                                 return <Alert color="dark" className={'all'} style={{margin:'auto', paddingRight:'5px'}} key={i}>{item}</Alert>
//                             })
//                         }
//                         </section>

                        
                    // </section>
                    // <footer id="footer">
                    //     <input required id="Message"  placeholder={'Message'}
                    //             onKeyPress={(e) => {
                    //             if (e.key === 'Enter') {
                    //             press(e)
                    //             }
                    //         }}
                    //     /> To: 
                    //         <input required id='Country' placeholder={tempToList && (tempToList.length>0)?tempToList:'Countries'}
                    //             onKeyPress={(e) => {
                    //             // if (e.key === 'Enter') {
                    //             // onMessageSend(e)
                    //             // }
                    //         }}
                    //     /> Enter to send

                    // </footer>
//                 </div>
//             </Card>
//         </div> 
//     );
// }
 
// export default MessageBox;