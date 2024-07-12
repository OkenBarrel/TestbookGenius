import {Button,DialogContent,TextField,Grid} from '@mui/material';
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

    useEffect(() => {
        fetch("/api/login")
        .then(res=>{
            return res.json()
        })
        .then(data=>{
            setUser(data.user_id)
        })
    }, []);

    return(
        <Card sx={{width:500,height:100}}>
            
        </Card>
    )
}
export default HelloComponent;
