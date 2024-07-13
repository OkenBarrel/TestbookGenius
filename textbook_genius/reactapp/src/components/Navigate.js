import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navigate = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div>
      <Box border = "0px dotted #acf" width = "350px" >
        <Grid container spacing={0} alignItems="flex-end" >
          <Grid item>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Typography variant="h3" onClick={handleClick} color="primary" >
                TextbookGenius
              </Typography>
            </Link>
          </Grid>
          <Grid item marginBottom = "2px">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Typography variant="h5" onClick={handleClick} color="primary" >
                北工大教材资源整合平台
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Navigate;
