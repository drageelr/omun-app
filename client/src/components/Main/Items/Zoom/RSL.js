import React, {useState, useEffect} from 'react';
import { Paper, Button, List, ListItem, Select, FormControl, InputLabel, Typography} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
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


function RSLRow({countryName, id, topicId, delegateId, imageName, canEdit, visible, spoken, editRSL, changeSpeaker}) {
    const [state, setState] = React.useState(initialState);

    function handleClick(event) {
        event.preventDefault(); // right click
        setState({ mouseX: event.clientX - 2, mouseY: event.clientY - 4 });
    };

    function handleClose() {
        setState(initialState);
    };

    function toggleVisible() {
        editRSL({topicId, topicSpeakerId: id,  delegateId, visible: !visible});
        handleClose();
    }

    function toggleSpoken() {
        editRSL({topicId, topicSpeakerId: id, delegateId, spokenTime: spoken ? 0 : 1});
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


export default function RSL({type, rsList, delegates, session, delegatesList, addToRSL, editRSL, fetchRSL, setRSLSpeaker}) {
    const classes = useStyles();
    const [selDelegateId, setSelDelegateId] = useState(0);

    function changeSelection(e) {
        const newSelection = e.target.value;
        console.log(newSelection);
        setSelDelegateId(Number(newSelection));
    };

    function handleAddToRSL() {
        addToRSL(selDelegateId);
    };

    function changeSpeaker(speakerId) {
        setRSLSpeaker(speakerId);
    };

    useEffect(() => {
        if (session.topicId !== null || session.topicId !== 0) {
            fetchRSL(session.topicId);
        }
        else {
            fetchRSL();
        }
    }, [session.topicId])

    return (
        <List>
            {
                type === 'dias' &&
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <FormControl className={classes.formControl}>
                        <InputLabel>Select Delegate</InputLabel>
                        <Select
                        value={selDelegateId}
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
                    <Button size='small' className={classes.iconButton} variant="contained" startIcon={<AddIcon/>} color="primary" onClick={handleAddToRSL}>Add To RSL</Button>
                </div>
            }
            <div className={classes.contentStyle}>
                {
                    rsList &&
                    rsList.filter(rs => (type == 'dias' || rs.visible))
                    .map(({id, delegateId, visible, spokenTime},i)=> (
                        (type == 'dias' || visible) &&
                        <RSLRow
                        key={i} 
                        id={id}
                        topicId={session.topicId}
                        countryName={delegates[delegateId] && delegates[delegateId].countryName} 
                        imageName={delegates[delegateId] && delegates[delegateId].imageName} 
                        delegateId={delegateId} 
                        visible={visible} 
                        spoken={spokenTime}
                        canEdit={type == 'dias'}
                        changeSpeaker={changeSpeaker}
                        editRSL={editRSL}
                        />
                    ))
                }  
            </div>
        </List>
    );
}
