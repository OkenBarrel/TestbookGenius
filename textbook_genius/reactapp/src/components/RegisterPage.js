import React, { useState,useEffect } from "react";
import { Button, Grid, Typography, TextField, Paper } from "@mui/material";
import Alert from "@mui/material/Alert";
import { getCsrfToken } from "./CSRFToken";

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [valiCode,setValiCode]=useState("");
  const [timeLeft, setTimeLeft] = useState(0); // 120秒的倒计时
  const [isRegistered,setIsRegestered]=useState(false);
  const [validationError,setValidationError]=useState("");


  const csrftoken = getCsrfToken(); 

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    // Validate inputs
    if (!email || !username || !password || !confirmPassword) {
      setError('Email, username, password, and confirm password are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const apiUrl = '/api/register';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ 
          user_name: username, 
          user_password: password,
          user_email : email,
          validation:valiCode
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsRegestered(true);
        setSuccess('Registration successful!');
        // navigator("/");
        // Optionally clear form fields after successful registration
      
      } else {
        setError(data.msg || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  const handleValidation=async (e)=>{
    setValiCode(e.target.value)
    if(timeLeft!=0){
      return;
    }
    const requestOption={
      method:"POST",
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify({ 
        email:email
      })

    }
    let response=await fetch("/api/validation",requestOption)
    let data=await response.json()
    if(!response.ok){
      console.log(response.statusText)
      setValidationError(data.msg);
      return;
    }
    setTimeLeft(120);

  };

  useEffect(()=>{
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  },[timeLeft])

  useEffect(() => {
    if (timeLeft <= 0 && !isRegistered) {
      // 倒计时结束并且用户没有注册成功时，发起API请求
      const requestOption={
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ 
          email: email 
        }), // 假设你需要发送的email
      }
      fetch('/api/validation',requestOption)
        // .then((response) => response.json())
        // .then((data) => {
        //   console.log('API Response:', data);
        //   // 处理API响应
        // })
        // .catch((error) => {
        //   console.error('API Error:', error);
        // });
    }

    // 计时器
  }, [timeLeft, isRegistered]);

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Paper elevation={3} style={{ padding: 20, maxWidth: 400 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <form noValidate autoComplete="off">
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <TextField
            label="Validation"
            // type="password"
            margin="normal"
            variant="outlined"
            value={valiCode}
            error={validationError}
            helperText={validationError}
            onChange={(e) => setValiCode(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ marginTop: 20 }}
            onClick={handleValidation}
          >
            {timeLeft === 0 ? '获取验证码' : timeLeft}
            {/* {timeLeft=120?"获取验证码":timeLeft} */}
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: 20 }}
            onClick={handleRegister}
          >
            Register
          </Button>
        </form>
        {error && <Alert severity="error" style={{ marginTop: 20 }}>{error}</Alert>}
        {success && <Alert severity="success" style={{ marginTop: 20 }}>{success}</Alert>}
      </Paper>
    </Grid>
  );
};

export default RegisterPage;
