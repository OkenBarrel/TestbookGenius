import {Button,DialogContent,TextField,Grid} from '@mui/material';
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
import {getCsrfToken} from "./CSRFToken";

function UpdateBookPage(props){
    const { isbn } = useParams();
    const[title,setTitle]=useState("");
    const[author,setAuthor]=useState("");
    const[publisher,setPublisher]=useState("");
    const[pubdate,setPubdate]=useState("");
    const[cover,setCover]=useState("");
    const[douban_url,setDouban]=useState("");

    /*const[buy_kong,setKong]=useState("")
    const[buy_dang,setDang]=useState("")
    const[buy_bookchina,setBookchina]=useState("")
    const[buy_fish,setFish]=useState("")
    const[buy_jie,setJie]=useState("")*/
      
    /*
    let res= fetch("/api/get-book"+"?isbn="+isbn)
    let data=res.json()*/

    const navigate=useNavigate();
    const csrftoken=getCsrfToken();

    useEffect(() => {
        console.log(isbn);
        fetch("/api/get-book"+"?isbn="+isbn)
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

           /* setKong("https://search.kongfz.com/product/?keyword="+isbn+"&dataType=0")
            setDang("http://search.dangdang.com/?key="+isbn+"&act=input")
            setBookchina("https://www.bookschina.com/book_find2/?stp="+isbn+"&sCate=0")
            setFish("https://www.duozhuayu.com/search/book/"+isbn)
            setJie("https://www.jiushujie.com/sell?q="+isbn) */
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
        let response=await fetch("/api/update-book",requestOption)
        let data=await response.json();
        navigate('/book/'+isbn);
    }

    return(
        <div className='updateBookPage'>
            <Grid container spacing={3} align="center" justifyContent="center">
                <Grid container spacing={2} item xs={6}>
                    <Grid item xs={12} align="center">
                        <h1>This is update Book</h1>
                    </Grid>  
                    <Grid item xs={12} align="center">
                        <TextField value={isbn} label={"ISBN"}/>    
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField value={title} label={"书名"} onChange={(e)=>{setTitle(e.target.value)}}/>    
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField value={author} label={"作者"} onChange={(e)=>{setAuthor(e.target.value)}}/>    
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField value={publisher} label={"出版社"} onChange={(e)=>{setPublisher(e.target.value)}}/>    
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField value={pubdate} label={"出版日期"} onChange={(e)=>{setPubdate(e.target.value)}}/>    
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField value={cover} label={"封面"} onChange={(e)=>{setCover(e.target.value)}}/>    
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField value={douban_url} label={"豆瓣链接"} onChange={(e)=>{setDouban(e.target.value)}}/>    
                    </Grid>
                    <Grid item xs={12} align="center">
                        <Button variant="contained" onClick={handleSubmit}>修改</Button>
                    </Grid>
                    {/*<Grid item xs={12} align="center">
                        <Button variant="contained" to={buy_kong} component={Link}>孔夫子旧书网购买</Button>
                        <Button variant="contained" to={buy_dang} component={Link}>当当网购买</Button>
                        <Button variant="contained" to={buy_bookchina} component={Link}>中图网购买</Button>
                        <Button variant="contained" to={buy_fish} component={Link}>多抓鱼购买</Button>
                        <Button variant="contained" to={buy_jie} component={Link}>旧书街购买</Button>
                    </Grid>*/}
                </Grid>
            </Grid>
        </div>
    );

}
export default UpdateBookPage