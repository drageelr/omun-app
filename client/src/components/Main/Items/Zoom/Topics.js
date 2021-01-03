import React, {useState, useEffect} from 'react';
import { Paper, Card, CardContent, List, ListItem, ListItemText} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


export default function Topics({}) {
    let [topics, setTopics] = useState(["T1", "T2"]);

    return (
        <List>
        {
            topics && 
            topics.map((item,i)=> (
                <ListItem key={i} dense>
                    <ListItemText primary={item} />
                </ListItem>
            ))
        }  
        </List>
    );
}