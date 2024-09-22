import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography, Box, Avatar, Link } from '@mui/material';
// import Search from './Search';
// import NavigateButton from './Navigate';
// import HelloComponent from './HelloComponent';
// import Pagination from '@mui/material/Pagination';
// import { getCsrfToken } from './CSRFToken';
import { getCookie,getCsrfToken } from './CSRFToken';

const Top=()=>{

    const [results,setResults]=useState([]);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        setLoading(true)
        getTops()

    },[])
    const getTops=async ()=>{
        const csrftoken=getCsrfToken();
  
        const requestOption={
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            credentials: 'include',
        };
        let response=await fetch("http://localhost:8000/api/rank?top="+5,requestOption);
        if (response.ok){
            // setResults(response.json());
            let data=await response.json();
            setResults(data);
            // console.log(data);
            setLoading(false);
        }
    }

    return(
        <div>
            <Grid item>
        <div style={{ marginTop: '10px' }}>
          <Grid item xs={12}>
            <h2>热门搜索 Top 5</h2>
          </Grid>
        </div>        
      </Grid>
      <Grid item xs={12}>
        {/* {console.log(results)} */}
        {/* {results.length} */}
        {loading ? (
          <Typography variant="body1" align="center">Loading...</Typography>
        ) : (
            results.length > 0 ? (
            <>
            {/* {console.log("rendering")}
            {console.log(results)} */}
              <Grid container spacing={2} justifyContent="center">
                {results.map((result) => (
                  <Grid item key={result.isbn} xs={12} style={{ marginBottom: 10, display: 'center', maxWidth: 300, justifyContent: 'center' }}>
                    <a href={`/book/${result.isbn}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <Card style={{ width: '100%', minHeight: 250, alignContent: "ceneter" }}>
                        <Grid container direction="row" spacing='10%'sx={{borderTop:'10%', marginLeft:'0%'}}>
                            <Grid item alignContent="center" justifyContent="center" xs={6} sm={6} md={6} lg={6} xl={6}>
                              <Box sx={{border: "0px solid"}}>
                                <CardContent>
                                  <Typography variant="h5">{result.title}</Typography>
                                  <Typography variant="subtitle1">{result.publisher}</Typography>
                                  <Typography variant="subtitle1">
                                    {Array.isArray(result.author) && result.author.length > 0
                                      ? result.author.join(', ')
                                      : 'Author information not available'}
                                  </Typography>
                                </CardContent>                                  
                              </Box>
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                              <Box sx={{border: "0px solid"}}>
                                <CardMedia
                                component="img"
                                sx={{ 
                                    minHeight: 200,
                                    minWidth: 100,
                                    objectFit: 'contain' 
                                    }}
                                image={`http://localhost:8000/api/proxy-image?url=${encodeURIComponent(result.cover)}`}
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
              {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              </Box> */}
            </>
          ) : (
            <Typography variant="body1" align="center">No results found</Typography>
          )
        )}
      </Grid>
        </div>

    );
}

export default Top;