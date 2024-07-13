import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navigate = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/search');
  };

  return (
    <Grid container spacing={0} alignItems="flex-end">
      <Grid item>
        <Link to="/search" style={{ textDecoration: 'none' }}>
          <Typography variant="h5" onClick={handleClick} >
            TextbookGenius
          </Typography>
        </Link>
      </Grid>
      <Grid item>
        <Link to="/search" style={{ textDecoration: 'none' }}>
          <Typography variant="subtitle2" onClick={handleClick} >
            北工大教材资源整合平台
          </Typography>
        </Link>
      </Grid>
    </Grid>
  );
};

export default Navigate;
