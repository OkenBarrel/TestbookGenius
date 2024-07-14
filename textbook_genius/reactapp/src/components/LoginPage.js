import {Button,DialogContent,Grid,Typography,TextField, Paper, Box} from '@mui/material';
import React,{Component, useState} from "react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getCookie, getCsrfToken } from './CSRFToken';
import Alert from '@mui/material/Alert';
import Home from './Navigate';
import HelloComponent from './HelloComponent';


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
            const response=await fetch('http://8.130.18.80:80/api/login',requestOption);
            if(!response.ok){
                const errorData = await response.json();
                setError(errorData.msg || 'Invalid username or password.');
                return;
            }
            const data = await response.json();
            setSuccess('Login successful!');
            if(location.state && location.state.fromRegister){
                navigate('/');
            }else{
                navigate(-1);
            }

        }catch (error) {
            setError('An error occurred. Please try again.');
        }
    };
    return (
        <Grid container justifyContent="center" spacing="100px" style={{ minHeight: '100%' }}>
            <Grid item width = "100%">
                <Box border = "0px dotted #acf" width = "100%">
                    <Grid container spacing={0} sx={{display:'flex', flexDirection:'row'}} style={{ marginTop: '5px', marginLeft: '5%' }}>
                        <Grid item xs={7} sm={7} md={7} align="left" style={{ marginTop: '16px'}}>
                            <Home />
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} align="right">
                            <HelloComponent user_name={getCookie('username')} id={getCookie('user_id')}/>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item justifyContent="center" >
                <Paper elevation={3} style={{ padding: 20, maxWidth: 600 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        用户登录
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
                            登录
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{ marginTop: 20 }}
                            component={Link}
                            to={`/register`} 
                        >
                            注册
                        </Button>
                    </form>
                    {error && <Alert severity="error" style={{ marginTop: 20 }}>{error}</Alert>}
                    {success && <Alert severity="success" style={{ marginTop: 20 }}>{success}</Alert>}
                </Paper>
            </Grid>
        </Grid>
    );
}
export default LoginPage;