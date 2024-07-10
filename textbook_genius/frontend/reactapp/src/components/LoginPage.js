import {Button,DialogContent,Grid,Typography,TextField, Paper} from '@mui/material';
import React,{Component, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { getCsrfToken } from './CSRFToken';
import Alert from '@mui/material/Alert';


const LoginPage = () => {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const csrftoken=getCsrfToken();

    async function handleLogin(){
        //TODO: Just a dummy function, please use API to handle login function
        setError('');
        setSuccess('');
        if (!username || !password) {
            setError('Username and password are required.');
            return;
        };
        setTimeout(() => {
            const requestOption={
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken
                },
                body:JSON.stringify({
                    username:username,
                    password:password
                })
            };
            let response=fetch('/api/login',requestOption);
            if(!response.ok){
                setError(response.statusText);
                return;
            }

            // if (username === 'tw11' && password === 'password' && username === 'tw11') {
            //     setSuccess('Login successful!');
            //     // navigate(`/}`);
            //     //TODO: just for demo, please change to a real page.
            // } else {
            //     setError('Invalid username or password(For test purpose, please using tw11 to login).');
            // }
        }, 1000);
    };
    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Paper elevation={3} style={{ padding: 20, maxWidth: 400 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                <form noValidate autoComplete="off">
                    <TextField
                        label="Username"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: 20 }}
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                </form>
                {error && <Alert severity="error" style={{ marginTop: 20 }}>{error}</Alert>}
                {success && <Alert severity="success" style={{ marginTop: 20 }}>{success}</Alert>}
            </Paper>
        </Grid>
    );
}
export default LoginPage;