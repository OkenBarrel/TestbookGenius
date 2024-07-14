import {Button, DialogContent, TextField, Grid, Box, Card, CardContent} from '@mui/material';
import { useState, useEffect } from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import { getCookie } from './CSRFToken';
import {getCsrfToken} from "./CSRFToken";

const HelloComponent = ({user_name,id}) => {
    const csrftoken = getCsrfToken();

    const [user, setUser] = useState("Please Login");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // const username = getCookie('username');
        // const userid = getCookie('userid');
        // const username;
        // const userid;
        let username;
        let userid;
        if(user_name===null && id===null){
            username = getCookie('username');
            userid = getCookie('user_id');
            
        }else{
            username = user_name;
            userid = id;
        }
        
        if (username == null) {
            console.log("user_id is null!");
            setUser("Please Login");
            setIsLoggedIn(false);
        } else {
            setUser("Hello, " + username);
            setIsLoggedIn(true);
            setUserId(userid);
        }
    }, [user_name,id]);

    return (
        <Box border = "0px dotted #acf" width = "100%">
            <Grid alignSelf="flex-end">
                {isLoggedIn ? (
                    // getCookie('user_id')
                    <Link to={`/user/${userId}`} component={Link} style={{ textDecoration: 'none' }} color="primary">
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