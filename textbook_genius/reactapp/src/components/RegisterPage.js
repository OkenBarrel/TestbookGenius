import React, { useState, useEffect } from "react";
import { Button, Grid, Typography, TextField, Paper, Box, Link, Avatar } from "@mui/material";
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
  const[user_id,setId]=useState(null);
  const[user_name,setName]=useState(null);
  const[avatar_url,setUrl]=useState(null);

  const csrftoken = getCsrfToken(); 
  const navigate = useNavigate();

  const getLog=async ()=>{
    let response=await fetch("http://localhost:8000/api/is-loggedin",{
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

    const apiUrl = 'http://192.168.225.149:80/api/register';
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
    let response = await fetch("http://192.168.225.149:80/api/validation", requestOption);
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
      fetch('http://192.168.225.149:80/api/validation', requestOption);
    }
  }, [timeLeft, isRegistered]);

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
            <Paper elevation={3} sx={{ padding: '10px', marginTop:'40px' }}>
              <Grid container width='100%' justifyContent="center" sx={{padding: '10px',marginBottom: '30px'}}>
                <Grid item width="100%">
                  <h1>用户注册</h1>                                
                </Grid>
                <Grid item width="100%">
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
                </Grid>
                <Grid item width="100%">
                  {error && <Alert severity="error" style={{ marginTop: 20 }}>{error}</Alert>}
                  {success && <Alert severity="success" style={{ marginTop: 20 }}>{success}</Alert>}
                </Grid>
              </Grid>
            </Paper>
          </Box>
      </Grid>
    </Grid>

  );
};

export default RegisterPage;