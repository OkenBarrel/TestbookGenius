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
import { getCookie } from './CSRFToken';
import {getCsrfToken} from "./CSRFToken";

const HelloComponent=()=>{
    const csrftoken=getCsrfToken();

    const[user,setUser]=useState("Please Login")

    useEffect(() => {
        //fetch("/api/login")
        /*.then(res=>{
            if(res.username==null){
                console.log("user_id is null!")
                setUser("Please Login")
            }
            else{
                setUser("Hello, "+res.username)
            }
        })*/
       if(getCookie('username')==null){
            console.log("user_id is null!")
            setUser("Please Login")
       }
       else{
            setUser("Hello, "+getCookie('username'))
       }
      
    }, []);

    return(
        <Grid container spacing={1} item xs={12} >
            <Grid item xs={12}>
                <h3>{user}</h3>
            </Grid>
        </Grid>
    )
}
export default HelloComponent;
