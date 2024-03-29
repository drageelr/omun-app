import React, {useState, useEffect} from 'react';
import { Paper, Card, CardContent, Button, List, ListItem, ListItemText, Select, FormControl, InputLabel, Typography, Box, CircularProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Switch from '@material-ui/core/Switch';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FlagIfAvailable from './FlagIfAvailable';

const initialState = {
    mouseX: null,
    mouseY: null,
};

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
        marginTop: 0
    },
    contentStyle:  {
        padding:0, 
        paddingTop: 5, 
        height:'27vh', 
        overflowY: "scroll"
    },
    delegateSelector: {
        maxHeight: '4vh',
        height: '4vh'
    },
    iconButton: {
        width: '7vw',
        height: '3vw',
        padding: 5,
        fontSize: '0.7rem'
    }
}));


function GSLRow({countryName, delegateId, imageName, canEdit, visible, spoken, editGSLHelper, changeSpeaker}) {
    const [state, setState] = React.useState(initialState);

    function handleClick(event) {
        event.preventDefault(); // right click
        setState({ mouseX: event.clientX - 2, mouseY: event.clientY - 4 });
    };

    function handleClose() {
        setState(initialState);
    };

    function toggleVisible() {
        editGSLHelper({visible: !visible});
        handleClose();
    }

    function toggleSpoken() {
        editGSLHelper({spokenTime: spoken ? 0 : 1});
        handleClose();
    }

    function handleSpeaker() {
        changeSpeaker(delegateId);
        handleClose();
    }


    return (
    <ListItem onContextMenu={handleClick} style={{ cursor: 'context-menu' }} key={delegateId} style={{paddingLeft: 10}} dense>            
        <Paper style={{backgroundColor: visible ? '#ffcf33' : 'whitesmoke', marginBottom: 2, width: '46.7vw', display:'flex', flexDirection:'row'}}>
            <FlagIfAvailable imageName={imageName}/>
            <Typography style={{margin: 5, marginTop: 7, fontSize: '0.9rem', textDecoration: spoken ? 'line-through' : '', color: visible ? 'black' : '#000000', fontWeight: 500, wordWrap: "break-word"}}>
                {countryName}
            </Typography>
        </Paper>
        {
            canEdit &&
            <Menu keepMounted open={state.mouseY !== null} onClose={handleClose} anchorReference="anchorPosition"
            anchorPosition={ state.mouseY !== null && state.mouseX !== null ? { top: state.mouseY, left: state.mouseX } : undefined }>
                <MenuItem onClick={toggleVisible}>{visible ? 'Hide' : 'Show'}</MenuItem>
                <MenuItem onClick={toggleSpoken}>{spoken ? 'Mark Unspoken' : 'Mark Spoken'}</MenuItem>
                <MenuItem onClick={handleSpeaker}>Set Speaker</MenuItem>
            </Menu>
        }
    </ListItem>
    );
}


export default function GSL({type, gsList, delegates, reachedTop, singleAddition, delegatesList, addToGSL, editGSL, fetchGSL, setGSLSpeaker}) {
    const classes = useStyles();
    const [selectedDelegateId, setSelectedDelegateId] = useState(0);
    const scrollContainer = React.createRef();
    const [fetching, setFetching] = useState(true);


    function changeSelection(e) {
        const newSelection = e.target.value;
        console.log(newSelection);
        setSelectedDelegateId(Number(newSelection));
    };

    function handleAddToGSL() {
        //add selected delegate id to GSL selectedDelegateId
        console.log(selectedDelegateId);
        addToGSL(selectedDelegateId);
    };

    function changeSpeaker(speakerId) {
        setGSLSpeaker(speakerId);
    };

    function handleScroll(e) {
        let element = e.target;
        if (element.scrollTop===0) {
            if (!reachedTop) {
                setFetching(true);
                setTimeout(() => fetchGSL(), 500);
            }
        }
    }

    React.useEffect(() => {
        if (singleAddition) {
            scrollContainer.current.scrollTo(0, scrollContainer.current.scrollHeight-scrollContainer.current.clientHeight);
        }
        else if(!reachedTop) { //fetch multiple and top not reached
            scrollContainer.current.scrollTo(0, scrollContainer.current.clientHeight+300);
        }
        setFetching(false);
    }, [gsList])

    return (
        <List>
            {
                type === 'dias' &&
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <FormControl className={classes.formControl}>
                        <InputLabel>Select Delegate</InputLabel>
                        <Select
                        value={selectedDelegateId}
                        onChange={changeSelection}
                        className={classes.delegateSelector}
                        >
                        {
                            delegatesList.map((d, i) => (
                                <MenuItem key={i} value={d.id}>{d.countryName}</MenuItem>
                            ))
                        }
                        </Select>
                    </FormControl>
                    <Button size='small' className={classes.iconButton} variant="contained" startIcon={<AddIcon/>} color="primary" onClick={handleAddToGSL}>Add To GSL</Button>
                </div>
            }
            <div ref={scrollContainer} onScroll={handleScroll}  className={classes.contentStyle}>
                {
                    fetching && !reachedTop &&
                    <Box style={{margin: 4, display: 'flex', justifyContent: 'center'}}>
                        <CircularProgress size={30} color="secondary" />
                    </Box>
                }
                {
                    gsList &&
                    gsList.filter(gs => (type == 'dias' || gs.visible))
                    .map(({id, delegateId, visible, spokenTime},i)=> (
                        (type == 'dias' || visible) &&
                        <GSLRow
                        key={i} 
                        id={id}
                        countryName={delegates[delegateId].countryName} 
                        imageName={delegates[delegateId].imageName} 
                        delegateId={delegateId} 
                        visible={visible} 
                        spoken={spokenTime}
                        canEdit={type == 'dias'}
                        changeSpeaker={changeSpeaker}
                        editGSLHelper={(editParams) => editGSL(id, editParams)}
                        />
                    ))
                }  
            </div>
        </List>
    );
}
