import {Button,DialogContent,TextField,Grid, Box, Card, CardContent} from '@mui/material';
import { useState,useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Redirect,
    Switch
} from "react-router-dom";
import {getCsrfToken} from "./CSRFToken";

const HelloComponent=()=>{
    const csrftoken=getCsrfToken();

    const[user,setUser]=useState("haha")

    /*useEffect(() => {
        fetch("/api/login")
        .then(res=>{
            return res.json()
        })
        .then(data=>{
            setUser(data.user_id)
        })
    }, []);*/

    return(
        /*<Card sx={{width:500,height:30}}>
            <CardContent>
                <Grid container spacing={1} item xs={12} >
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center',flexDirection:'row' }}>
                            <p>Hello,{user}</p>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>*/
        <Grid container spacing={1} item xs={12} >
            <Grid item xs={12}>
                <h2>Hello,{user}</h2>
            </Grid>
        </Grid>
    )
}
export default HelloComponent;
