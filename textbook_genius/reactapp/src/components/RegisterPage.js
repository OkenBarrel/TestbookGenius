import React, { useState, useEffect } from "react";
import { Button, Grid, Typography, TextField, Paper, Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useNavigate } from 'react-router-dom';
import { getCookie,getCsrfToken } from './CSRFToken';
import Home from './Navigate';
import HelloComponent from './HelloComponent';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordHint, setPasswordHint] = useState('密码至少包含8个字符，且包括字母、数字和特殊字符(_@!*&%$#^)中的至少一个。');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ConfirmPasswordHint, setConfirmPasswordHint]= useState('');
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

    const apiUrl = 'http://localhost:8000/api/register';
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email must be in a valid format (example@example.com).');
      return;
    }

   
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
          navigate('/login', { state: { fromRegister: true } });
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

   // 验证密码：不能为纯数字，且至少8位
   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[_@!*&%$#^])[A-Za-z\d_@!*&%$#^]{8,}$/;
   const handlePasswordChange = (event) => {

     const input = event.target.value;
     console.log(input);
     setPassword(input);
     const isValid = passwordRegex.test(input);
     console.log(isValid);
     if (isValid) {
       setPasswordHint('密码格式正确。');
     } else {
       setPasswordHint('请确保密码至少包含8个字符，且包括字母、数字和特殊字符(_@!*&%$#^)中的至少一个。');
     }
   };

   // 验证确认密码：必须与密码相同
  const handleConfirmPasswordChange = (event) => {
    const input = event.target.value;
    console.log(input);
    setConfirmPassword(input);
    const isMatch = input === password; // 确认密码必须与之前输入的密码相同
    console.log(isMatch);
    if (isMatch) {
      setConfirmPasswordHint('密码匹配。');
    } else {
      setConfirmPasswordHint('密码不匹配，请确保两次输入的密码相同。');
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
    };
    let response = await fetch("http://localhost:8000/api/validation", requestOption);
    let data = await response.json();
    if (!response.ok) {
      console.log(response.statusText);
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
      fetch('http://localhost:8000/api/validation', requestOption);
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
              <HelloComponent user_name={getCookie('username')} id={getCookie('user_id')}/>
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
              onChange={handlePasswordChange}
              fullWidth 
              error={passwordHint !== '密码至少包含8个字符，且包括字母、数字和特殊字符(_@!*&%$#^)中的至少一个。' && passwordHint !== '密码格式正确。' }
              helperText={passwordHint}
              margin="normal"
              variant="outlined"              
              value={password}
            />
            <TextField
              label="Confirm Password"
              type="password"
              onChange={handleConfirmPasswordChange}
              fullWidth
              error={ConfirmPasswordHint && ConfirmPasswordHint !== '密码匹配。' }
              helperText={ConfirmPasswordHint}
              margin="normal"
              variant="outlined"
              value={confirmPassword}
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