import {Button,DialogContent,Grid,Typography,TextField, Paper} from '@mui/material';
import React,{Component, useState} from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { getCsrfToken } from './CSRFToken';
import Alert from '@mui/material/Alert';


const LoginPage = () => {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const csrftoken=getCsrfToken();

    const location = useLocation()
    const { state } = location
    console.log(location, state);

    async function handleLogin(){
        //TODO: Just a dummy function, please use API to handle login function
        setError('');
        setSuccess('');
        if (!username || !password) {
            setError('Username and password are required.');
            return;
        };
       try{
            const requestOption={
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken
                },
                credentials: 'include',
                body:JSON.stringify({
                    username:username,
                    password:password
                })
            };
            const response=await fetch('http://localhost:8000/api/login',requestOption);
            if(!response.ok){
                const errorData = await response.json();
                setError(errorData.msg || 'Invalid username or password.');
                return;
            }
            const data = await response.json();
            setSuccess('Login successful!');
            navigate(-1);
            // if (username === 'tw11' && password === 'password' && username === 'tw11') {
            //     setSuccess('Login successful!');
            //     // navigate(`/}`);
            //     //TODO: just for demo, please change to a real page.
            // } else {
            //     setError('Invalid username or password(For test purpose, please using tw11 to login).');
            // }
        }catch (error) {
            setError('An error occurred. Please try again.');
        }
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