import React, {useState} from 'react'
import {start , end , join , fetchCommittees } from './Actions';
import { makeStyles } from '@material-ui/core/styles';
import {Select, Button, InputLabel, MenuItem, FormControl } from '@material-ui/core';
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

function Home({user, setSeverity, setStatus}){
    const classes = useStyles();
    const [SessionSt, setSessionSt] = useState('0');
    const [openSt, setOpenSt] = useState(false);
    const [SessionEn, setSessionEn] = useState('0');
    const [openEn, setOpenEn] = useState(false);
    const [SessionJ, setSessionJ] = useState('0');
    const [openJ, setOpenJ] = useState(false);
    const [loada, setLoada] = useState(false);
    const [loadb, setLoadb] = useState(false);
    const [sessions , setSessions] =useState([]);
    const [committeeIds , setCommitteeIds] =useState({});

    const override = css`
        display: block;
        margin: 0 auto;
        border-color: grey;
    `;


    React.useEffect(() => {
        let selfCommitteeId = user.committeeId;
        setSessionSt(selfCommitteeId);
        setSessionEn(selfCommitteeId);
        setSessionJ(selfCommitteeId);

        if (user.type == "admin") {
            fetchCommitteesForAdmin();
        }
    }, []);

    async function fetchCommitteesForAdmin() {
        try{
            const initialIdMap = await fetchCommittees();
            console.log(initialIdMap);
            setSessions(Object.keys(initialIdMap)); //keys will give initials
            setCommitteeIds(initialIdMap);
        } 
        catch(e){
            console.error(e);
            setSeverity('error');
            setStatus(e); 
        }
    }


    function handleChangeSt(event){
        setSessionSt(event.target.value);
    };
    function handleChangeEn(event){
        setSessionEn(event.target.value);
    };
    function handleChangeJ(event){
        setSessionJ(event.target.value);
    };

    function handleCloseSt(){
        setOpenSt(false);
    };
    function handleCloseEn(){
        setOpenEn(false);
    };
    function handleCloseJ(){
        setOpenJ(false);
    };

    function handleOpenSt(){
        setOpenSt(true);
    };
    function handleOpenEn(){
        setOpenEn(true);
    };
    function handleOpenJ(){
        setOpenJ(true);
    };

    async function handleStart(){
        setLoada(true);
        try{
            await start({committeeId: SessionSt});
            setSeverity('success');
            setStatus("Session started."); 
        } 
        catch(e){
            setSeverity('error');
            setStatus(e);
        }
        
        setLoada(false);
    };

    async function handleEnd(){
        if (window.confirm('Are you sure you wish to stop this session?')) {
            setLoadb(true);
            try{
                await end({committeeId: SessionEn});
                setSeverity('success');
                setStatus("Session stopped.");
            } 
            catch(e){
                setSeverity('error');
                setStatus(e);
            }
            setLoadb(false);
        }
    };

    async function handleJoin(){
        sessionStorage.committeeId = SessionJ;
        try{
            await join({committeeId: SessionJ});
            setSeverity('success');
            setStatus("Joining Session...");
            window.open("/main","_self");
        } 
        catch(e){
            setSeverity('error');
            setStatus(e);
        }
    };

    function handleSignout() {
        sessionStorage.removeItem('user');
        window.open("/","_self");
    }


    return( 
        <div className="auth-inner" id="homeList" style={{textAlign:'center'}}>
            <h3>{user.type == "dias" ? "Dais" : user.type == "admin" ? "Admin" : "Delegate"} Portal</h3>
            <h6><i>Welcome {user.name}</i></h6>
            {
                user.type !== "admin" && //DIAS AND DELEGATE ONLY
                <Button color="secondary" variant="contained" onClick={handleJoin}>Join Your Session</Button>
            }
            {   // DIAS ONLY
                user.type === 'dias' &&
                <>
                    <Button color="primary" variant="contained" onClick={handleStart}>Start Your Session</Button>
                    <FadeLoader
                        css={override}
                        height={13}
                        width={2}
                        radius={10}
                        color={"red"}
                        loading={loada}
                    />
                    <Button color="primary" variant="contained" onClick={handleEnd} >Stop Your Session</Button>
                    <FadeLoader
                        css={override}
                        height={13}
                        width={2}
                        radius={10}
                        color={"red"}
                        loading={loadb}
                    />
                </>
            }
            {   // ADMIN ONLY
                user.type === 'admin' &&
                <>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-controlled-open-select-label">Committee</InputLabel>
                        <Select open={openSt} onClose={handleCloseSt} onOpen={handleOpenSt} value={SessionSt} onChange={handleChangeSt}>
                        { 
                            sessions.map((value, index)=> <MenuItem key={index} value={committeeIds[value]}>{value}</MenuItem>) //value is ID
                        } 
                        </Select>
                    </FormControl>
                    <Button color="primary" variant="contained" onClick={handleStart}> Start </Button>
                    <FadeLoader css={override} height={13} width={2} radius={10} color={"red"} loading={loada}/>
                    <br/>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-controlled-open-select-label">Committee</InputLabel>
                        <Select open={openEn} onClose={handleCloseEn} onOpen={handleOpenEn} value={SessionEn} onChange={handleChangeEn}>
                        {sessions.map((value, index)=> <MenuItem key={index} value={committeeIds[value]}>{value}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button color="primary" variant="contained" onClick={handleEnd}> Stop </Button>
                    <FadeLoader css={override} height={13} width={2} radius={10} margin={1} color={"red"} loading={loadb}/>
                    <br/>
                    <FormControl className={classes.formControl}>
                        <InputLabel>Committee</InputLabel>
                        <Select open={openJ} onClose={handleCloseJ} onOpen={handleOpenJ} value={SessionJ} onChange={handleChangeJ}>
                        {sessions.map((value, index)=> <MenuItem key={index} value={committeeIds[value]}>{value}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button color="primary" variant="contained" onClick={handleJoin}> Join </Button>
                    <br/>
                    <Button color="secondary" variant="contained" href="/Create">Create Entries</Button>
                </>
            }
            <Button color="primary" variant="outlined" href="/ChangePassword">Change Password</Button>
            <br/>
            <Button color="primary" variant="outlined" onClick={handleSignout}>Sign Out</Button>        
        </div>
    )
}

export default Home