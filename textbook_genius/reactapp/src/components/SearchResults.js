import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import Search from './Search';
import NavigateButton from './Navigate';
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
          const response = await fetch(`http://localhost:8000/api/search/results?query=${encodeURIComponent(query)}&page=${page}`);
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
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
      <Grid container>
        <Grid item xs={12}>
          <NavigateButton />
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
                    <Grid item key={result.book.isbn} xs={12} style={{ marginBottom: 20 }}>
                      <a href={`/book/${result.book.isbn}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <Card style={{ width: '100%', minHeight: 150, padding: 16 }}>
                          <CardContent>
                            <Typography variant="h5">{result.book.title}</Typography>
                            <Typography variant="subtitle1">{result.book.publisher}</Typography>
                            <Typography variant="subtitle1">{result.book.author ? result.book.author.join(', ') : ''}</Typography>
                            <Typography variant="body2">课程: {result.course ? result.course.course_name : ''}</Typography>
                            <Typography variant="subtitle2">教师: {result.teacher ? result.teacher.teacher_name : ''}</Typography>
                            <Typography variant="body2">开课学部: {result.course ? result.course.department : ''}</Typography>
                          </CardContent>
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