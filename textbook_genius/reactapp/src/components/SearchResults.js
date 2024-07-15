import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography, Box, Avatar, Link } from '@mui/material';
import Search from './Search';
import NavigateButton from './Navigate';
import HelloComponent from './HelloComponent';
import Pagination from '@mui/material/Pagination';
import { getCookie,getCsrfToken } from './CSRFToken';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const query = useQuery().get('query');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [out,setOut]=useState(false);
  const [user_id,setId]=useState(null);
  const [user_name,setName]=useState(null);
  const [avatar_url,setUrl]=useState(null);

  async function handleLogout(){
    const csrftoken=getCsrfToken();
  
    const requestOption={
  
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
      },
      credentials: 'include',
    }
  
    let response=await fetch("http://8.130.18.80:80/api/logout",requestOption);
    if(!response.ok){
      console.log("log out failed");
      return;
    }
    setName(getCookie('username'));
    setId(getCookie('user_id'));
    setUrl(null);
  
  }
  
  const getLog=async ()=>{
    let response=await fetch("http://8.130.18.80:80/api/is-loggedin",{
      credentials:'include'
    });
    let data=await response.json()
    setUrl(data.avatar_url)

  }

  useEffect(() => {
    getLog();
    setName(getCookie('username'));
    setId(getCookie('user_id'));
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        if (query) {
          const response = await fetch(`http://8.130.18.80:80/api/search?query=${encodeURIComponent(query)}`);
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
    <Grid container sx={{display:'flex',alignItems:'center', flexDirection:'column'}}>
      <Grid item width="100%">
          <Box width="90%" display="flex" justifyContent="right" sx={{marginTop: '20px', marginLeft: '5%', marginRight: '5%' }}>
              <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item align="left">
                      <NavigateButton />
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
      <Grid width = "90%" style={{ marginTop: '5px'}}>
          <Search/>
      </Grid>
      <Grid item>
        <div style={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            <h1>搜索结果</h1>
          </Grid>
        </div>        
      </Grid>
      <Grid item xs={12}>
        {loading ? (
          <Typography variant="body1" align="center">Loading...</Typography>
        ) : (
          results.length > 0 ? (
            <>
            {console.log("rendering")}
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
                                  <Typography variant="subtitle1">
                                    {Array.isArray(result.book.author) && result.book.author.length > 0
                                      ? result.book.author.join(', ')
                                      : 'Author information not available'}
                                  </Typography>
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
                                image={`http://8.130.18.80:80/api/proxy-image?url=${encodeURIComponent(result.book.cover)}`}
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

  );
};

export default SearchResults;