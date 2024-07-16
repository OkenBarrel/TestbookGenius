import {Button,DialogContent,Grid,Typography,TextField, Paper, Box, Avatar} from '@mui/material';
import React,{Component, useState, useEffect} from "react";
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
    const[user_id,setId]=useState(null);
    const[user_name,setName]=useState(null);
    const[avatar_url,setUrl]=useState(null);
    const navigate = useNavigate();
    const csrftoken=getCsrfToken();

    const location = useLocation()
    const { state } = location
    console.log(location, state);

    const getLog=async ()=>{
        let response=await fetch("http://localhost:800000/api/is-loggedin",{
          credentials:'include'
        });
        let data=await response.json()
        setUrl(data.avatar_url)
    
    }
    
    useEffect(()=>{
        getLog();
        setName(getCookie('username'));
        setId(getCookie('user_id'));
    },[]);

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
        <Grid container sx={{display:'flex',alignItems:'center', flexDirection:'column'}}>
            <Grid item width = "100%">
                <Box width="90%" display="flex" justifyContent="right" sx={{marginTop: '10px', marginLeft: '5%', marginRight: '5%' }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item align="left" style={{ marginTop: '16px'}}>
                            <Home />
                        </Grid>
                        <Grid item align="right">
                            <Box width="100%" sx={{ textAlign: 'right',minWidth:'200px' }}>
                                <Grid container alignItems="flex-end" justifyContent="space-between">
                                    <Grid item>
                                        <Box>
                                            {console.log("name" + user_name)}
                                            <Link to={`/user/${user_id}`}>
                                                <Avatar src={avatar_url} sx={{ width: 55, height: 55 }} />
                                            </Link>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Box>
                                            <HelloComponent user_name={user_name} id={user_id} /> 
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" >
                <Box width ="60%" alignItems="center" justifyContent="center" border="0px solid">
                    <Paper elevation={3} style={{ padding: '10px', marginTop:'40px' }}>
                        <Grid container width='100%' justifyContent="center" sx={{padding: '10px',marginBottom: '30px'}} alignContent="center">
                            <Grid item width="100%" maxWidth="550px">
                               <h1>用户登录</h1>                                
                            </Grid>
                            <Grid item width ="100%">
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
                            </Grid>
                            <Grid item width ="100%">
                                {error && <Alert severity="error" style={{ marginTop: 20 }}>{error}</Alert>}
                                {success && <Alert severity="success" style={{ marginTop: 20 }}>{success}</Alert>}
                            </Grid>

                        </Grid>
                    </Paper>
                </Box>
            </Grid>
        </Grid>
    );
}
export default LoginPage;