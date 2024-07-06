import React, { useState } from "react";
import { Button, Grid, Typography, TextField, Paper } from "@mui/material";
import Alert from "@mui/material/Alert";

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    // Validate inputs
    if (!username || !password || !confirmPassword) {
      setError('Username, password, and confirm password are required.');
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
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful!');
        // Optionally clear form fields after successful registration
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Paper elevation={3} style={{ padding: 20, maxWidth: 400 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
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
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
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
