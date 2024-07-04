import {Button,DialogContent,TextField,Grid} from '@mui/material';
import {Box,ThemeProvider} from '@mui/material';
import { useState,useEffect } from 'react';
import {useNavigate} from 'react-router-dom';

function UpdateBookPage(props){
    {/*initial value is different, depends on the book information*/}
    {/*const[isbn,setIsbn]=useState(0);*/}
    const[title,setTitle]=useState("");
    const[author,setAuthor]=useState("");
    const[publisher,setPublisher]=useState("");
    const[pubdate,setPubdate]=useState("");
    const[cover,setCover]=useState("");
    const[douban_url,setDouban]=useState("");

    const navigate=useNavigate();

    function handleSubmit(){
        console.log("handling submit")
        const requestOption={
            method:"PATCH",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({
                book:{
                    title:title,
                    author:author,
                    publisher:publisher,
                    pubdate:pubdate,
                    cover:cover,
                    douban_url:douban_url
                },
            }),
        };
        fetch("/api/update-book",requestOption)
        .then((response)=>response.json())
    }

    return(
        <div className='updateBookPage'>
            <Grid container spacing={3} align="center" justifyContent="center">
                <Grid container spacing={2} item xs={6}>
                    <Grid item xs={12} align="center">
                        <h1>This is update Book</h1>
                    </Grid>  
                    {/*<Grid item xs={12} align="center">
                        <h1>ISBN:</h1>

                    </Grid> */ }
                    <Grid item xs={12} align="center">
                        <TextField value={title} label={"书名"} onChange={(e)=>{setTitle(e.target.value)}}/>    
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField value={title} label={"作者"} onChange={(e)=>{setAuthor(e.target.value)}}/>    
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField value={title} label={"出版社"} onChange={(e)=>{setPublisher(e.target.value)}}/>    
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField value={title} label={"出版日期"} onChange={(e)=>{setPubdate(e.target.value)}}/>    
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField value={title} label={"豆瓣链接"} onChange={(e)=>{setDouban(e.target.value)}}/>    
                    </Grid>
                    <Grid item xs={12} align="center">
                        <Button variant="contained" onClick={handleSubmit}>修改</Button>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );

}
export default UpdateBookPage