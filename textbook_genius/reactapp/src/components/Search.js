import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Box } from '@mui/material';

const Search = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`http://8.130.18.80:80/search/results?query=${encodeURIComponent(query)}`);
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
      <Grid container spacing={.5} alignItems="center" justifyContent="space-between">
        <Grid item xs={10} sm={10} md={10} align="left">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="请输入您想搜索的课本"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </Grid>
        <Grid item xs={1.5} sm={1.5} md={1.5} align="right">
          <Button variant="contained" color="primary" onClick={handleSearch}>
            搜索
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Search;
