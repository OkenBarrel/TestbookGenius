import React from 'react';
import { Box, Typography } from '@mui/material';
import Search from './Search';
import NavigateButton from './Navigate';

const SearchPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100%"
    >
        <Box mb={6}>
            <NavigateButton />
        </Box>
        <Box mb={1}>
            <Search />
        </Box>
    </Box>
  );
};

export default SearchPage;
