import React, { useState, useEffect } from "react";
import { Button, Grid, Typography, TextField, Paper, Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useNavigate } from 'react-router-dom';
import { getCsrfToken } from "./CSRFToken";
import Home from './Navigate';
import HelloComponent from './HelloComponent';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [valiCode, setValiCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0); // 120秒的倒计时
  const [isRegistered, setIsRegistered] = useState(false);
  const [validationError, setValidationError] = useState('');

  const csrftoken = getCsrfToken(); 
  const navigate = useNavigate();

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

    const apiUrl = 'http://8.130.18.80:80/api/register';

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
          user_email: email,
          validation: valiCode
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsRegistered(true);
        setSuccess('Registration successful!');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
        return;
      } else {
        setError(data.msg || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  const handleValidation = async (e) => {
    setValiCode(e.target.value);
    if (timeLeft !== 0) {
      return;
    }
    const requestOption = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify({ 
        email: email
      })
    }
    let response=await fetch("http://8.130.18.80:80/api/validation",requestOption)
    let data=await response.json()
    if(!response.ok){
      console.log(response.statusText)
  
      setValidationError(data.msg);
      return;
    }
    setTimeLeft(120);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0 && !isRegistered) {
      const requestOption = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ 
          email: email 
        }),
      };
      fetch('http://8.130.18.80:80/api/validation', requestOption);
    }
  }, [timeLeft, isRegistered]);

  return (
    <Grid container justifyContent="center" spacing="30px" style={{ minHeight: '100vh' }}>
      <Grid item width="100%">
        <Box border="0px dotted #acf" width="100%">
          <Grid container spacing={0} sx={{ display: 'flex', flexDirection: 'row' }} style={{ marginTop: '5px', marginLeft: '5%' }}>
            <Grid item xs={7} sm={7} md={7} align="left" style={{ marginTop: '16px' }}>
              <Home />
            </Grid>
            <Grid item xs={4} sm={4} md={4} align="right">
              <HelloComponent />
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item justifyContent="center" alignItems="center" style={{ minHeight: '100vh', marginTop: '10px' }}>
        <Paper elevation={3} style={{ padding: 20, maxWidth: 600 }}>
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
    </Grid>
  );
};

export default RegisterPage;