import React from 'react';
import { Box } from '@mui/material';
import Search from './Search';
import NavigateButton from './Navigate';

const SearchPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="62vh"
      width="100%"
    >
        <Box width="80%" alignItems="left">
            <NavigateButton />
        </Box>
        <Box width="80%">
            <Search />
        </Box>
    </Box>
  );
};

export default SearchPage;
