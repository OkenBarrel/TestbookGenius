import React, { Component, useState,useEffect } from "react";
import {Button,DialogContent,Grid,Card,Box, CardContent,CardMedia} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
// import CreateBookPage from "./CreateBookPage";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Redirect,
} from "react-router-dom";

const Book=()=>{
    const { isbn } = useParams();
    const [title,setTitle]=useState("");
    const[author,setAuthor]=useState("");
    const[cover,setCover]=useState("");
    const[douban_url,setDouban]=useState("")
    const[publisher,setPublisher]=useState("")
    const[pubdate,setPubdate]=useState("")
    const navigate=useNavigate();

    useEffect(() => {
        console.log(isbn);
        getBookDetails();
      }, []);

    async function getBookDetails(){
        let res=await fetch("/api/get-book"+"?isbn="+isbn)
        if(!res.ok){
            navigate("/");
        }
        let data=await res.json()
        setTitle(data.title);
        setAuthor(data.author);
        setCover(data.cover);
        setDouban(data.douban_url);
        setPubdate(data.pubdate);
        setPublisher(data.publisher);
        
        // .then((response)=>{
        //     return response.json();
        // })
        // .then((data)=>{
        //     setTitle(data.title)
        // })
    }

    return(
        <div>
            <h2>This is Book {title}</h2>
            <Card variant="outlined"  align="center" jutifyContent="center" sx={{display:"flex",maxWidth: 700,maxHeight: 400}}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                    {/* <Grid container spacing={3} align="center" justifyContent={"center"}> */}
                        <Grid container spacing={1} item xs={12} >
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center',flexDirection:'row' }}>
                                    <p >标题：</p>
                                    <p >{title}</p>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center',flexDirection:'row' }}>
                                    <p>作者：</p>
                                    <p>{author}</p>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center',flexDirection:'row' }}>
                                    <p>出版社：</p>
                                    <p>{publisher}</p>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center',flexDirection:'row' }}>
                                    <p>出版日期：</p>
                                    <p>{pubdate}</p>
                                </Box>
                            </Grid>
                            <Grid item xs={12} align="center">
                                <Button variant='contained' to="./update" component={Link}>修改书籍信息</Button>
                            </Grid>
                        {/* </Grid> */}

                        {/* <Grid item xs={6}>
                            <Box height={200} width={200} sx={{ p: 2, border: '1px dashed grey' }}>
                                <img src={cover}/>
                            </Box>
                        </Grid> */}
                    </Grid>
                    </CardContent>
                </Box>
                <CardMedia
                    component="img"
                    sx={{ 
                        maxWidth: '100',
                        // maxHeight: '50%',
                        // width: '100%',
                        // height: '100%',
                        objectFit: 'contain' // or 'scale-down', 'fill', 'cover'
                      }}
                    image={cover}
                    title="cover"
                />
            </Card>
        </div>
    );

}
export default Book;