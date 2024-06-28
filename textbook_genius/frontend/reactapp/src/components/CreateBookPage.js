import {Button,DialogContent,TextField,Grid} from '@mui/material';
import {Box,ThemeProvider} from '@mui/material';

import { useState,useEffect } from 'react';
import {useNavigate} from 'react-router-dom';


function CreateBookPage(props){

    const[isbn,setIsbn]=useState(0);
    // const[info,setInfo]=useState("");
    const[title,setTitle]=useState("");
    const[author,setAuthor]=useState("");
    const[cover,setCover]=useState("");
    const[douban_url,setDouban]=useState("")
    const[publisher,setPublisher]=useState("")
    const[pubdate,setPubdate]=useState("")
    
    const navigate=useNavigate();

    async function handleSearchButton(){
        let response= await fetch("/api/get-douban-book"+"?isbn="+isbn)
        console.log(await response.json()
        .then((data)=>{setTitle(data.title);
            setAuthor(data.author);
            setCover(data.images.small);
            setDouban(data.alt);
            setPublisher(data.publisher);
            setPubdate(data.pubdate);

                                                        }))
    }
    function handleSubmit(){
        console.log("handling submit")
        const requestOption={
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({
                isbn:isbn,
                title:title,
                author:author,
                publisher:publisher,
                pubdate:pubdate,
                cover:cover,
                douban_url:douban_url
                

            }),
        };
        fetch("/api/create-book",requestOption)
        .then((response)=>response.json())
        .then((data)=>navigate('/book/'+data.isbn));

    };

    return(
        <div className='createBookPage'>
            <Grid container spacing={3} align="center" justifyContent="center">
                <Grid container spacing={3} item xs={6} >
                    <Grid item xs={12} align="center">
                        <h1>This is create Book</h1>
                    </Grid>
                    <Grid item xs={12} align="center">
                            <TextField label={'输入ISBN号，获取书籍信息'} onChange={(e)=>{setIsbn(e.target.value)}}></TextField>
                        <item>
                            <Button variant="contained" onClick={handleSearchButton}>搜索</Button>
                        </item>

                    </Grid>
                    {/* <Grid item xs={2} align="center">
                        {/* <item> */}
                            {/* <Button variant="contained" onClick={handleSearchButton}>搜索</Button> */}
                        {/* </item> */}

                    
                    <Grid item xs={12} align="center">
                        <TextField value={title} label={"标题"} onChange={(e)=>{setTitle(e.target.value)}}/>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField value={author} label={"作者"} onChange={(e)=>{setAuthor(e.target.value)}}/>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField value={publisher} label={"出版社"} onChange={(e)=>{setPublisher(e.target.value)}}/>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <Button variant="contained" onClick={handleSubmit}>创建</Button>
                    </Grid>

                </Grid>
                <Grid container item xs={2}>
                    <p>this is cover</p>
                    <img src={cover}/>
                </Grid>
            </Grid>

        </div>
    );
}

export default CreateBookPage;