import React, {useState, useEffect} from 'react';
import './Zoom.css'
import { Paper, Tabs, Tab, Card, CardContent, List, ListItem, ListItemText} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';


const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  
  function createData(Id, calories, fat, carbs, protein) {
    return { Id, calories, fat, carbs, protein };
  }

  const rows = [
    createData('1', 'Pak', 6.0, 24, 4.0),
    createData('2', 'Ind', 9.0, 37, 4.3),
  ];
    
function GSL({tempToList, placement}) {
    let [gsList, setGSList] = useState(["GSL1", "GSL2", "GSL3"]);
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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
    const classes = useStyles();
    const selectedBGStyle = {backgroundColor: "cornflowerblue", color:"white", borderColor: "#F5FFFA"}
    const normalBGStyle = {backgroundColor: "#FFD700", color:"white"}
    const whiteBG = {backgroundColor: "#FFFFFF", color:"white"}


    const [stateVisible, setVisibleState] = React.useState("false")
    const [stateSet, setSetState] = React.useState("false")

    // checkedVisible: true,
    // checkedSet: true,

    // const handleChange = (event) => {
    // setState({ ...state, [event.target.name]: event.target.checked });
    // };
    
    function handleVisible(){
        console.log(stateVisible)
        setVisibleState(!stateVisible)
    }

    function handleSetState(){
        console.log(stateSet)
        setSetState (!stateSet)
    }

    return(
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="center">Delegate Name</TableCell>
              <TableCell align="center">Text</TableCell>
              <TableCell align="center">Visible</TableCell>
              <TableCell align="center">Set</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row,i) => (
              <TableRow key={row.Id}
              style={stateSet=="true"? selectedBGStyle : whiteBG,
              stateVisible=="true"? normalBGStyle : whiteBG
            //   stateSet=="true"? selectedBGStyle : normalBGStyle,
            //   stateSet=="true"? selectedBGStyle : normalBGStyle
              }>
                <TableCell component="th" scope="row">
                  {row.Id}
                </TableCell>
                <TableCell align="center">{row.calories}</TableCell>
                <TableCell align="center"> 
                    <TextField id="outlined-basic" label="Description" variant="outlined" />    
                </TableCell>
                <TableCell align="right">
                    <Switch
                        // checked={state.checkedVisible}
                        // onChange={handleChange}
                        onClick={handleVisible}
                        name="checkedVisible"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                </TableCell>
                <TableCell align="right">
                    <Switch
                        // checked={state.checkedSet[i]}
                        // onChange={handleChange}
                        onClick={handleSetState}
                        name="checkedSet"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        
        // <List>
        // {
        //     topics && 
        //     topics.map((item,i)=> (
        //         <ListItem key={i} dense>
        //             <ListItemText primary={item} />
        //         </ListItem>
        //     ))
        // }  
        // </List>
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