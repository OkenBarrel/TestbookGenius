import {Button,DialogContent,TextField,Grid,Box} from '@mui/material';
import { useState,useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Redirect,
    Switch
} from "react-router-dom";
import HelloComponent from './HelloComponent';
import {getCsrfToken} from "./CSRFToken";
import Home from "./Navigate";

function UpdateBookPage(props){
    const { isbn } = useParams();
    const[title,setTitle]=useState("");
    const[author,setAuthor]=useState("");
    const[publisher,setPublisher]=useState("");
    const[pubdate,setPubdate]=useState("");
    const[cover,setCover]=useState("");
    const[douban_url,setDouban]=useState("");

    const navigate=useNavigate();
    const csrftoken=getCsrfToken();

    useEffect(() => {
        console.log(isbn);
        fetch("http://8.130.18.80:80/api/get-book"+"?isbn="+isbn)
        .then(res=>{
            return res.json()
        })
        .then(data=>{
            setTitle(data.title);
            setAuthor(data.author);
            setPubdate(data.pubdate);
            setPublisher(data.publisher);
            setCover(data.cover);
            setDouban(data.douban_url);
        })
    }, []);  

    async function handleSubmit(){
        console.log("handling submit")
        const requestOption={
            method:"PATCH",
            headers:{
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            body:JSON.stringify({
                book:{
                    isbn:isbn,
                    title:title,
                    author:author,
                    publisher:publisher,
                    pubdate:pubdate,
                    cover:cover,
                    douban_url:douban_url
                },
            }),
        };
        let response=await fetch("http://8.130.18.80:80/api/update-book",requestOption)
        let data=await response.json();
        navigate('/book/'+isbn);
    }

    return(
        <div className='updateBookPage'>
            <Grid container justifyContent="center" spacing="30px" style={{ minHeight: '100%' }}>
                <Grid item width = "100%">
                    <Box border = "px dotted #acf" width = "100%">
                        <Grid container spacing={0} sx={{display:'flex', flexDirection:'row'}} style={{ marginTop: '5px', marginLeft: '5%' }}>
                            <Grid item xs={7} sm={7} md={7} align="left" style={{ marginTop: '16px'}}>
                                <Home />
                            </Grid>
                            <Grid item xs={4} sm={4} md={4} align="right">
                                <HelloComponent />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item width = "100%">
                    <Grid container alignItems="center" justifyContent="center" >
                        <Box width ="60%" alignItems="center" justifyContent="center" border={"0px solid"}>
                            <Grid container spacing={2} direction="column" >
                                <Grid item align="center"> 
                                    <h1>修改书籍信息</h1>
                                </Grid>
                                <Grid item align="center">
                                    <TextField value={isbn} label={"ISBN"} sx={{ width: '70%' }}/>    
                                </Grid>
                                <Grid item align="center">
                                    <TextField value={title} label={"书名"} onChange={(e)=>{setTitle(e.target.value)}} sx={{ width: '70%' }}/>    
                                </Grid>
                                <Grid item align="center">
                                    <TextField value={author} label={"作者"} onChange={(e)=>{setAuthor(e.target.value)}} sx={{ width: '70%' }}/>    
                                </Grid>
                                <Grid item align="center">
                                    <TextField value={publisher} label={"出版社"} onChange={(e)=>{setPublisher(e.target.value)}} sx={{ width: '70%' }}/>    
                                </Grid>
                                <Grid item align="center">
                                    <TextField value={pubdate} label={"出版日期"} onChange={(e)=>{setPubdate(e.target.value)}} sx={{ width: '70%' }}/>    
                                </Grid>
                                <Grid item align="center">
                                    <TextField value={cover} label={"封面"} onChange={(e)=>{setCover(e.target.value)}} sx={{ width: '70%' }}/>    
                                </Grid>
                                <Grid item align="center">
                                    <TextField value={douban_url} label={"豆瓣链接"} onChange={(e)=>{setDouban(e.target.value)}} sx={{ width: '70%' }}/>    
                                </Grid>
                                <Grid item align="center">
                                    <Button variant="contained" onClick={handleSubmit} sx={{ width: '70%' }}>修改</Button >
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>

            </Grid>
        </div>
    );

}
export default UpdateBookPage