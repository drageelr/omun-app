import React, {useState, useEffect} from 'react';
import { Paper, Card, CardContent, Button, List, ListItem, ListItemText, TextField, Select, FormControl, InputLabel, Typography, Input, Box, CircularProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Switch from '@material-ui/core/Switch';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MaskedInput from 'react-text-mask';
import { secToMinsec } from '../InfoBar/InformationBar'
import FlagIfAvailable from '../Zoom/FlagIfAvailable'

const initialState = {
    mouseX: null,
    mouseY: null,
};

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
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
    timeGetter: {
        width: 42,
        margin: 15,
        fontSize: '0.5rem',
        marginTop: -3
        // padding: 0
    },
    timeGetterField: {
        paddingTop: 10,
    },
    descriptionField: {
        width: '19vw'
    },
    iconButton: {
        width: '7vw',
        height: '3vw',
        padding: 5,
        fontSize: '0.7rem'
    }
}));


function TopicRow({countryName, delegateId, description, imageName, canEdit, visible, totalTime, speakerTime, editTopicHelper, setCurrentTopic}) {
    const [state, setState] = useState(initialState);

    function handleClick(event) {
        event.preventDefault(); // right click
        setState({ mouseX: event.clientX - 2, mouseY: event.clientY - 4 });
    };

    function handleClose() {
        setState(initialState);
    };

    function toggleVisible() {
        editTopicHelper({visible: !visible});
        handleClose();
    }

    function changeCurrentTopic() {
        setCurrentTopic();
        handleClose();
    }

    function changeDescription() {
        editTopicHelper({description: prompt('Enter new description.')});
        handleClose();
    }

    function changeSpeakerTime() {
        editTopicHelper({speakerTime: minsecToSeconds(prompt('Enter new speaker time. [mm:ss]'))});
        handleClose();
    }

    function changeTotalTime() {
        editTopicHelper({totalTime: minsecToSeconds(prompt('Enter new total time. [mm:ss]'))});
        handleClose();
    }

    const descStyle = {margin: 10, fontSize: '0.9rem', color: visible ? 'white' : '#000000', fontWeight: 500, wordWrap: "break-word", alignSelf: 'center'};

    return (
    <ListItem onContextMenu={handleClick} style={{ cursor: 'context-menu' }} key={delegateId} style={{paddingLeft: 10}} dense>            
        <div style={{display: 'flex', flexDirection: 'row', marginBottom: 2}}>
            <Paper style={{backgroundColor: visible ? '#aa9525' : 'whitesmoke', margin: 3, width: '12vw', display: 'flex', flexDirection: 'row'}}>
                <FlagIfAvailable imageName={imageName}/>
                <Typography style={descStyle}>
                    {countryName}
                </Typography>
            </Paper>
            <Paper style={{backgroundColor: visible ? '#aa2e25' : 'whitesmoke', margin: 3, width: '19vw'}}>
                <Typography style={descStyle}>
                    {description}
                </Typography>
            </Paper>
            <Paper style={{backgroundColor: visible ? '#555555' : 'whitesmoke', margin: 3, display: 'flex' }}>
                <Typography style={descStyle}>
                    {secToMinsec(totalTime)}
                </Typography>
            </Paper>
            <Paper style={{backgroundColor: visible ? '#555555' : 'whitesmoke', margin: 3, display: 'flex'}}>
                <Typography style={descStyle}>
                    {secToMinsec(speakerTime)}
                </Typography>
            </Paper>
        </div>
        {
            canEdit &&
            <Menu keepMounted open={state.mouseY !== null} onClose={handleClose} anchorReference="anchorPosition"
            anchorPosition={ state.mouseY !== null && state.mouseX !== null ? { top: state.mouseY, left: state.mouseX } : undefined }>
                <MenuItem onClick={changeCurrentTopic}>Set as Current Topic</MenuItem>
                <MenuItem onClick={toggleVisible}>{visible ? 'Hide' : 'Show'}</MenuItem>
                <MenuItem onClick={changeDescription}>Change Description</MenuItem>
                <MenuItem onClick={changeTotalTime}>Change Total Time</MenuItem>
                <MenuItem onClick={changeSpeakerTime}>Change Speaker TIme</MenuItem>
            </Menu>
        }
    </ListItem>
    );
}

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            // style=
            {...other}
            ref={(ref) => {
            inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/\d/, /\d/, ':', /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}

function minsecToSeconds(minsec){
    const [min, sec] = minsec.split(':');
    return Number(min)*60+Number(sec);
}

export default function Topics({type, topicsList, delegates, reachedTop, singleAddition, delegatesList, addTopic, editTopic, fetchTopics, setCurrentTopic}) {
    const classes = useStyles();
    const [selectedDelegateId, setSelectedDelegateId] = useState(0);
    const [speakerTime, setSpeakerTime] = useState('');
    const [totalTime, setTotalTime] = useState('');
    const [description, setDescription] = useState('');
    const scrollContainer = React.createRef();
    const [fetching, setFetching] = useState(true);


    function changeSelection(e) {
        const newSelection = e.target.value;
        setSelectedDelegateId(Number(newSelection));
    }

    function handleAddTopic() {
        //add selected delegate id to GSL selectedDelegateId
        addTopic(selectedDelegateId, description, minsecToSeconds(totalTime), minsecToSeconds(speakerTime));
    }

    function handleSpeakerTime(e) {
        setSpeakerTime(e.target.value);
    }

    function handleTotalTime(e) {
        setTotalTime(e.target.value);
    }

    function handleDescription(e) {
        if (e.target.value.length > 250) {
            alert('Description is too long. [250 characters max]');
        }
        else {
            setDescription(e.target.value);
        }
    }

    function handleScroll(e) {
        let element = e.target;
        if (element.scrollTop===0) {
            if (!reachedTop) {
                setFetching(true);
                setTimeout(() => fetchTopics(), 500);
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
    }, [topicsList])

    
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
                    <TextField
                    label="Description"
                    multiline
                    rowsMax={3}
                    value={description}
                    variant="outlined"
                    onChange={handleDescription}
                    className={classes.descriptionField}
                    />
                    <FormControl className={classes.timeGetter}>
                        <InputLabel htmlFor="formatted-text-mask-input">Topic Time</InputLabel>
                        <Input
                        value={totalTime}
                        onChange={handleTotalTime}
                        name="textmask"
                        inputComponent={TextMaskCustom}
                        className={classes.timeGetterField}
                        />
                    </FormControl>
                    <FormControl className={classes.timeGetter}>
                        <InputLabel htmlFor="formatted-text-mask-input">Speaker Time</InputLabel>
                        <Input
                        value={speakerTime}
                        onChange={handleSpeakerTime}
                        inputComponent={TextMaskCustom}
                        className={classes.timeGetterField}
                        />
                    </FormControl>
                    <Button className={classes.iconButton} variant="contained" startIcon={<AddIcon/>} color="primary" onClick={handleAddTopic}>Add Topic</Button>
                </div>
            }
            <div ref={scrollContainer} onScroll={handleScroll} className={classes.contentStyle}>
                {
                    fetching && !reachedTop &&
                    <Box style={{margin: 4, display: 'flex', justifyContent: 'center'}}>
                        <CircularProgress size={30} color="primary" />
                    </Box>
                }
                {
                    // only show certain topics that are invisible if you are dias
                    topicsList &&
                    topicsList.filter(topic => (type == 'dias' || topic.visible)).map(({id, description, delegateId, visible, totalTime, speakerTime},i)=> (
                        <TopicRow
                        key={i} 
                        id={id}
                        description={description}
                        countryName={delegates[delegateId].countryName} 
                        imageName={delegates[delegateId].imageName} 
                        totalTime={totalTime}
                        speakerTime={speakerTime}
                        delegateId={delegateId} 
                        visible={visible} 
                        setCurrentTopic={() => setCurrentTopic(id, totalTime, speakerTime)}
                        canEdit={type == 'dias'}
                        editTopicHelper={(editParams) => editTopic(id, editParams)}
                        />
                    ))
                }  
            </div>
        </List>
    );
}
