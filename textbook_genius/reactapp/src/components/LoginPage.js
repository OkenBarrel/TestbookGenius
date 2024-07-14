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
        if (!username || !password) {//用户名或密码为空
            setError('Username and password are required.');
            return;
        };
       try{
            const requestOption={
                method:"POST",//  POST 请求
                headers:{
                    "Content-Type": "application/json",// 设置请求头中的内容类型为 JSON
                    "X-CSRFToken": csrftoken// 设置请求头中的 CSRF 令牌
                },
                credentials: 'include',
                body:JSON.stringify({
                    username:username,
                    password:password// 请求体中包含用户名密码
                })
            };
            const response=await fetch('http://localhost:8000/api/login',requestOption);//发送登录请求到后端
            if(!response.ok){//响应不正常
                const errorData = await response.json();//获取错误信息
                setError(errorData.msg || 'Invalid username or password.');//打印错误提示
                return;
            }
            const data = await response.json();//获取响应数据
            setSuccess('Login successful!');//设置成功信息
            navigate(-1);//回到前一个页面
        }catch (error) {
            setError('An error occurred. Please try again.');// 捕获并设置错误信息
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