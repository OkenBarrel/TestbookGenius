import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Box } from '@mui/material';

const Search = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    console.log('query:'+query)
    if (query.trim()) {
      navigate(`/search/results?query=${encodeURIComponent(query)}`,{replace:true});
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Grid container spacing={0.5} alignItems="center" justifyContent="space-between">
        <Grid item xs={10.5} sm={10.5} md={10.5} align="left">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="请输入您想搜索的课本、课程、老师等"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </Grid>
        <Grid item xs={1} sm={1} md={1} align="center" sx={{paddingTop: 30}}>
          <Button variant="contained" color="primary" onClick={handleSearch} sx={{ width: '100%' }}>
            搜索
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Search;
