import {Button, DialogContent, TextField, Grid, Box, Card, CardContent} from '@mui/material';
import { useState, useEffect } from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import { getCookie } from './CSRFToken';
import {getCsrfToken} from "./CSRFToken";

const HelloComponent = () => {
    const csrftoken = getCsrfToken();

    const [user, setUser] = useState("Please Login");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const username = getCookie('username');
        const userid = getCookie('userid');
        
        if (username == null) {
            console.log("user_id is null!");
            setUser("Please Login");
            setIsLoggedIn(false);
        } else {
            setUser("Hello, " + username);
            setIsLoggedIn(true);
            setUserId(userid);
        }
    }, []);

    return (
        <Box border = "0px dotted #acf" width = "100%">
            <Grid alignSelf="flex-end">
                {isLoggedIn ? (
                    <Link to={`/user/${getCookie('userid')}`} style={{ textDecoration: 'none' }} color="primary">
                        <h3>{user}</h3>
                    </Link>
                ) : (
                    <Link to="/login" style={{ textDecoration: 'none' }} color="primary">
                        <h3>{user}</h3>
                    </Link>
                )}
            </Grid>
        </Box>

    );
}

export default HelloComponent;