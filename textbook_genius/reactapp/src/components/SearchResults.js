import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import Search from './Search';
import NavigateButton from './Navigate';
import HelloComponent from './HelloComponent';
import Pagination from '@mui/material/Pagination';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const query = useQuery().get('query');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        if (query) {
<<<<<<< HEAD
          const response = await fetch(`http://8.130.18.80:80/api/search?query=${encodeURIComponent(query)}`);
=======
          const response = await fetch(`http://localhost:8000/api/search/results?query=${encodeURIComponent(query)}&page=${page}`);
>>>>>>> 1709571c09594b844ba04bfdbf7a53e8ee6d2efb
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const data = await response.json();
          console.log(data);
          setResults(Array.isArray(data.results) ? data.results : []);
          setTotalPages(data.num_pages || 1);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 5 }}>
      <Grid container>
        <Grid item width="100%">
          <Grid item width = "100%">
              <Box border = "0px dotted #acf" width = "100%">
                  <Grid container spacing={0} sx={{display:'flex', flexDirection:'row'}}>
                      <Grid item xs={7} sm={7} md={7} align="left" >
                          <NavigateButton />
                      </Grid>
                      <Grid item xs={4} sm={4} md={4} align="right" >
                          <HelloComponent />
                      </Grid>
                  </Grid>
              </Box>
          </Grid>
          <Search />
        </Grid>
        <div style={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom align="center">搜索结果</Typography>
          </Grid>
        </div>
        <Grid item xs={12}>
          {loading ? (
            <Typography variant="body1" align="center">Loading...</Typography>
          ) : (
            results.length > 0 ? (
              <>
                <Grid container spacing={2} justifyContent="center">
                  {results.map((result) => (
                    <Grid item key={result.book.isbn} xs={12} style={{ marginBottom: 10, display: 'center', maxWidth: 700, justifyContent: 'center' }}>
                      <a href={`/book/${result.book.isbn}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <Card style={{ width: '100%', minHeight: 250, alignContent: "ceneter" }}>
                          <Grid container direction="row" spacing='10%'sx={{borderTop:'10%', marginLeft:'0%'}}>
                              <Grid item alignContent="center" justifyContent="center" xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Box sx={{border: "0px solid"}}>
                                  <CardContent>
                                    <Typography variant="h5">{result.book.title}</Typography>
                                    <Typography variant="subtitle1">{result.book.publisher}</Typography>
                                    <Typography variant="subtitle1">{result.book.author ? result.book.author.join(', ') : ''}</Typography>
                                    <Typography variant="body2">课程: {result.course ? result.course.course_name : ''}</Typography>
                                    <Typography variant="subtitle2">教师: {result.teacher ? result.teacher.teacher_name : ''}</Typography>
                                    <Typography variant="body2">开课学部: {result.course ? result.course.department : ''}</Typography>
                                  </CardContent>                                  
                                </Box>
                              </Grid>
                              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                                <Box sx={{border: "0px solid"}}>
                                  <CardMedia
                                  component="img"
                                  sx={{ 
                                      minHeight: 250,
                                      minWidth: 150,
                                      objectFit: 'contain' 
                                      }}
                                  image={`http://localhost:8000/api/proxy-image?url=${encodeURIComponent(result.book.cover)}`}
                                  title="cover"
                                  />                                  
                                </Box>

                              </Grid>
                          </Grid>
                        </Card>
                      </a>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              </>
            ) : (
              <Typography variant="body1" align="center">No results found</Typography>
            )
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchResults;