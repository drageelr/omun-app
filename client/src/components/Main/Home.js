import React, {useState} from 'react'
import {start , end , fetchCommittees } from './Actions';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { css } from "@emotion/core";
import FadeLoader from "react-spinners/FadeLoader";


const useStyles = makeStyles((theme) => ({
    button: {
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    }
}));

function Home({user}){
    const classes = useStyles();
    const [SessionSt, setSessionSt] = useState('0');
    const [openSt, setOpenSt] = useState(false);
    const [SessionEn, setSessionEn] = useState('0');
    const [openEn, setOpenEn] = useState(false);
    const [SessionJ, setSessionJ] = useState('0');
    const [openJ, setOpenJ] = useState(false);
    const [loada, setLoada] = useState(false)
    const [loadb, setLoadb] = useState(false)
    const [loadc, setLoadc] = useState(false)
    const [status, setStatus] = useState('')
    const [sessions , setSessions] =useState([]);
    const [committeeIds , setCommitteeIds] =useState({});

    async function callFetch() {
        try{
            const initialIdMap = await fetchCommittees();
            console.log(initialIdMap);
            setSessions(Object.keys(initialIdMap)); //keys will give initials
            setCommitteeIds(initialIdMap);
        } 
        catch(e){
            console.error(e);
            setStatus(e); 
        }
    }
    
    React.useEffect(() => {
        callFetch()
    }, []);


    const handleChangeSt = (event) => {
        setSessionSt(event.target.value);
    };
    const handleChangeEn = (event) => {
        setSessionEn(event.target.value);
    };
    const handleChangeJ = (event) => {
        setSessionJ(event.target.value);
    };

    const handleCloseSt = () => {
        setOpenSt(false);
    };
    const handleCloseEn = () => {
        setOpenEn(false);
    };
    const handleCloseJ = () => {
        setOpenJ(false);
    };

    const handleOpenSt = () => {
        setOpenSt(true);
    };
    const handleOpenEn = () => {
        setOpenEn(true);
    };
    const handleOpenJ = () => {
        setOpenJ(true);
    };

    const handleStart = async () => {
        setLoada(true);
        try{
            const res = await start({committeeId: SessionSt});
            setStatus("Session started.");
        } 
        catch(e){
            console.error(e);
            setStatus(e); 
        }
        
        setLoada(false);
    };
    const handleEnd = async () => {
        setLoadb(true);
        try{
            const res = await end({committeeId: SessionEn});
            setStatus("Session ended.");
        } 
        catch(e){
            console.error(e);
            setStatus(e); 
        }
        setLoadb(false);
    };

    const handleJoin = async () => {
        setLoadc(true);
        try{
            // const res = await join({committeeId: SessionJ});
            setStatus("Session joined.");
        } 
        catch(e){
            console.error(e);
            setStatus(e); 
        }
        setLoadc(false);
        window.open("/main","_self");
    };

    const override = css`
        display: block;
        margin: 0 auto;
        border-color: grey;
    `;

    if (user.type === 'admin')
    {
        return( 
            <div className="auth-inner">
                <div style={{textAlign:'center'}}>
                    <h3>Admin Portal</h3>
                    <h6><i>Welcome {user.name}</i></h6>
                    
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-controlled-open-select-label">Committee</InputLabel>
                        <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={openSt}
                        onClose={handleCloseSt}
                        onOpen={handleOpenSt}
                        value={SessionSt}
                        onChange={handleChangeSt}
                        >
                        { 
                            sessions.map((value, index)=> <MenuItem key={index} value={committeeIds[value]}>{value}</MenuItem>) //value is ID
                        } 
                        </Select>
                    </FormControl>
                    <Button className={classes.button} onClick={handleStart}>
                        Start
                    </Button>
                    <FadeLoader
                        css={override}
                        height={13}
                        width={2}
                        radius={10}
                        color={"red"}
                        loading={loada}
                    />
                    <br/>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-controlled-open-select-label">Committee</InputLabel>
                        <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={openEn}
                        onClose={handleCloseEn}
                        onOpen={handleOpenEn}
                        value={SessionEn}
                        onChange={handleChangeEn}
                        >
                        {sessions.map((value, index)=> <MenuItem key={index} value={committeeIds[value]}>{value}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button className={classes.button} onClick={handleEnd}>
                        Stop
                    </Button>
                    <FadeLoader
                        css={override}
                        height={13}
                        width={2}
                        radius={10}
                        margin={1}
                        color={"red"}
                        loading={loadb}
                    />
                    <br/>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-controlled-open-select-label">Committee</InputLabel>
                        <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={openJ}
                        onClose={handleCloseJ}
                        onOpen={handleOpenJ}
                        value={SessionJ}
                        onChange={handleChangeJ}
                        >
                        {sessions.map((value, index)=> <MenuItem key={index} value={committeeIds[value]}>{value}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button className={classes.button} onClick={handleJoin}>
                        Join
                    </Button>
                    <FadeLoader
                        css={override}
                        height={13}
                        width={2}
                        radius={10}
                        margin={1}
                        color={"red"}
                        loading={loadc}
                    />
                    <br/>
                    <Button color="primary" href="/Create">Create Entries</Button>
                    <br/>
                    <Button color="primary" href="/ChangePassword">Change Password</Button>
                    <br/>
                    <Button color="secondary" href="/">Signout</Button>
                </div>
                { status !== '' && <div className="message"> {status} </div> }
            </div>
        )
    }
    
    else if (user.type==='dias')
    return( 
        <div style={{textAlign:'center'}}>
            <h3>Dias Portal</h3>
            
            <Button color="default" onClick={handleStart}>Start Your Session</Button>
            <FadeLoader
                    css={override}
                    height={13}
                    width={2}
                    radius={10}
                    color={"red"}
                    loading={loada}
                />
            <br/>
            <Button color="default" onClick={handleEnd} >Stop Your Session</Button>
            <FadeLoader
                    css={override}
                    height={13}
                    width={2}
                    radius={10}
                    color={"red"}
                    loading={loadb}
                />
            <br/>
            <Button color="primary" onClick={handleJoin}>Join Your Session</Button>
            <FadeLoader
                    css={override}
                    height={13}
                    width={2}
                    radius={10}
                    color={"red"}
                    loading={loadc}
                />
            <br/>
            <Button color="primary" href="/ChangePassword">Change Password</Button>
            <br/>
            <Button color="secondary" href="/">Signout</Button>
        </div>
    )

    else if (user.type==='delegate')
    return( 
        <div style={{textAlign:'center'}}>
            <h3>Delegate Portal</h3>
            <h6><i>Welcome {user.name}</i></h6>
            <Button color="primary" onClick={handleJoin}>Join Your Session</Button>
            <FadeLoader
                    css={override}
                    height={13}
                    width={2}
                    radius={10}
                    color={"red"}
                    loading={loadc}
                />
            <br/>
            <Button color="primary" href="/ChangePassword">Change Password</Button>
            <br/>
            <Button color="secondary" href="/">Signout</Button>
        </div>
    );
}

export default Home