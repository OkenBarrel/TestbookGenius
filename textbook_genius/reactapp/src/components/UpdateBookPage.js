import {Button,DialogContent,TextField,Grid,Box,Avatar,Paper} from '@mui/material';
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
import {getCsrfToken, getCookie} from "./CSRFToken";
import Home from "./Navigate";

function UpdateBookPage(props){
    const { isbn } = useParams();
    const[title,setTitle]=useState("");
    const[author,setAuthor]=useState("");
    const[publisher,setPublisher]=useState("");
    const[pubdate,setPubdate]=useState("");
    const[cover,setCover]=useState("");
    const[douban_url,setDouban]=useState("");
    const[user_id,setId]=useState(null);
    const[user_name,setName]=useState(null);
    const[avatar_url,setUrl]=useState(null);

    const navigate=useNavigate();
    const csrftoken=getCsrfToken();

    const getLog=async ()=>{
        let response=await fetch("http://localhost:8000/api/is-loggedin",{
          credentials:'include'
        });
        let data=await response.json()
        setUrl(data.avatar_url)
    
    }

    useEffect(() => {
        console.log(isbn);
        fetch("http://localhost:8000/api/get-book"+"?isbn="+isbn)
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
            getLog();
            setName(getCookie('username'));
            setId(getCookie('user_id'));
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
        let response=await fetch("http://localhost:8000/api/update-book",requestOption)
        let data=await response.json();
        navigate('/book/'+isbn);
    }

    return(
        <div className='updateBookPage'>
            <Grid container sx={{display:'flex',alignItems:'center', flexDirection:'column'}}>
                <Grid item width = "100%">
                    <Box width="90%" display="flex" justifyContent="right" sx={{marginTop: '10px', marginLeft: '5%', marginRight: '5%' }}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item align="left" style={{ marginTop: '16px'}}>
                                <Home />
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
                <Grid item width = "100%">
                    <Grid container alignItems="center" justifyContent="center" >
                        <Box width ="60%" alignItems="center" justifyContent="center" border={"0px solid"}>
                            <Paper elevation={3} style={{ padding: '20px', marginTop:'40px' }}>
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
                                        <Button variant="contained" onClick={handleSubmit} sx={{ width: '70%',marginBottom:'35px' }}>修改</Button >
                                    </Grid>
                                </Grid>                                
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>

            </Grid>
        </div>
    );

}
export default UpdateBookPage