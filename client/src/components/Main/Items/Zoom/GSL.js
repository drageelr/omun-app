import React, {useState, useEffect} from 'react';
import { Paper, Card, CardContent, List, ListItem, ListItemText} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';



const initialState = {
    mouseX: null,
    mouseY: null,
};


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
}); 


function GSLRow() {
    const [state, setState] = React.useState(initialState);

    const handleClick = (event) => {
        event.preventDefault();
        setState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
        });
    };

    const handleClose = () => {
        setState(initialState);
    };
}

export default function GSL({placement}) {
    let [gsList, setGSList] = useState(["GSL1", "GSL2", "GSL3"]);
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    return (
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
    );
}
