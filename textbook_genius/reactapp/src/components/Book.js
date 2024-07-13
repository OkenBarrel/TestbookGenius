import React, { Component, useState,useEffect } from "react";
import {Button,Grid,Card,Box, CardContent,CardMedia} from '@mui/material';
import Alert from '@mui/material/Alert';
import StarIcon from '@mui/icons-material/Star';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useParams, useNavigate } from 'react-router-dom';
// import CreateBookPage from "./CreateBookPage";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import CommentComponet from "./CommentComponent";
import ScoreComponent from "./ScoreComponet";
import { getCookie } from './CSRFToken';
import { getCsrfToken } from './CSRFToken';

const Book=({relation})=>{
    const { isbn } = useParams();
    const [title,setTitle]=useState("");
    const[author,setAuthor]=useState("");
    const[cover,setCover]=useState("");
    const[douban_url,setDouban]=useState("")
    const[publisher,setPublisher]=useState("")
    const[pubdate,setPubdate]=useState("")

    const[buy_kong,setKong]=useState("")
    const[buy_dang,setDang]=useState("")
    const[buy_bookchina,setBookchina]=useState("")
    const[buy_jie,setJie]=useState("")

    const[mark,setMark]=useState(false) //mark action
    const[markid,setMarkId]=useState('')
    const[userid,setUserId]=useState('')
    const[username,setUserName]=useState('')

    const[relationerror,setRelationError]=useState('')

    const navigate=useNavigate();
    const csrftoken=getCsrfToken();

    useEffect(() => {
        //console.log(isbn);
        getBookDetails();
        setUserId(getCookie('user_id'))
        setUserName(getCookie('username'))
    }, []);

    async function getBookDetails(){
        let res=await fetch("http://localhost:8000/api/get-book"+"?isbn="+isbn)
        if(!res.ok){
            navigate("/");
            return;
        }
        let data=await res.json()
        setTitle(data.title);
        setAuthor(data.author);
        setCover(data.cover);
        setDouban(data.douban_url);
        setPubdate(data.pubdate);
        setPublisher(data.publisher);

        setKong("https://search.kongfz.com/product/?keyword="+isbn+"&dataType=0")
        setDang("http://search.dangdang.com/?key="+isbn+"&act=input")
        setBookchina("https://www.bookschina.com/book_find2/?stp="+isbn+"&sCate=0")
        setJie("https://www.jiushujie.com/sell?q="+isbn)
        
        // .then((response)=>{
        //     return response.json();
        // })
        // .then((data)=>{
        //     setTitle(data.title)
        // })
    }

    /*useEffect(()=>{
        console.log(relation);
       
    },[relation])*/

    /*const handleRequest = async (url, method, body) => {
        let requestOption = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify(body)
        };
        let response = await fetch(url, requestOption);
        if (!response.ok) {
            console.log(`${method} request failed`);
            return false;
        }
        return true;
    };*/

    async function handleMark(){
        
        if (mark) {
            // 取消收藏
            setMark(false);
        } else {
            // 进行收藏
            if(getCookie('username')==null){
                setRelationError('Please Login First');
                return;
            }
            console.log("mark"+isbn);
            console.log(getCookie('user_id'))
            setMark(true);
            setUserId(getCookie('user_id'))
            setUserName(getCookie('username'))
            
            const requestOption={
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken
                },
                body:JSON.stringify({
                    mark:{
                       // markid:markid,
                        userid:userid,
                        bookisbn:isbn
                    }
                   /* book:{
                        isbn:isbn,
                        title:title,
                        author:author,
                        publisher:publisher,
                        pubdate:pubdate,
                        cover:cover,
                        douban_url:douban_url
                    },
                    User:{
                        user_id:userid,
                        username:username
                    }*/

                })
            };
            let response=await fetch("/api/mark-book",requestOption)
            let data=await response.json();
            if(!response.ok){
                setRelationError(data.msg);
                return;
            }
            
        }
    }

    return(
        <div>
            <Grid container spacing={2} sx={{display:'flex',alignItems:'center', flexDirection:'row'}}>
                <Grid item xs={12} align="center">
                    <Button variant="contained" to="/" component={Link}>返回主页</Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <h2>This is Book {title}</h2>
                </Grid>
            </Grid>
            
            {/*<h2>This is Book {title}</h2>*/}
            <Card variant="outlined"  align="center" jutifyContent="center" sx={{display:"flex",maxWidth: 1400,maxHeight: 400}}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                    {/* <Grid container spacing={3} align="center" justifyContent={"center"}> */}
                        <Grid container spacing={1} item xs={12} >
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center',flexDirection:'row' }}>
                                    <p >标题:</p>
                                    <p >{title}</p>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center',flexDirection:'row' }}>
                                    <p>作者:</p>
                                    <p>{author}</p>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center',flexDirection:'row' }}>
                                    <p>出版社:</p>
                                    <p>{publisher}</p>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center',flexDirection:'row' }}>
                                    <p>出版日期:</p>
                                    <p>{pubdate}</p>
                                </Box>
                            </Grid>
                            <Grid item spacing={2} xs={12} align="center">
                                <Button variant='contained' to="./update" component={Link}>修改书籍信息</Button>
                                <Tooltip title="收藏书籍">
                                    <IconButton type="button" onClick={handleMark}>
                                        <StarIcon variant="contained" style={{ color: mark ? "#ffcc00" : "#353838" }}/>
                                    </IconButton>
                                </Tooltip>
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
                    {cover && (
                        <CardMedia
                        component="img"
                        sx={{ 
                            maxWidth: 300, // 设定合适的 CSS 单位
                            objectFit: 'contain' // or 'scale-down', 'fill', 'cover'
                            }}
                        image={`http://localhost:8000/api/proxy-image?url=${encodeURIComponent(cover)}`}
                        title="cover"
                        />
                    )}
                <Box align="center" justifyContent="center" alignItems="flex-end" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} align="center">
                            <Button variant="contained" to={buy_dang} component={Link}>当当网购买</Button>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Button variant="contained" to={buy_bookchina} component={Link}>中国图书网购买</Button>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Button variant="contained" to={buy_kong} component={Link}>孔夫子旧书网购买</Button>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Button variant="contained" to={buy_jie} component={Link}>旧书街购买</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
            
            {/* <Card> */}
            <CommentComponet isbn={isbn}/>

            {/* </Card> */}
            
            
        </div>
    );

}
export default Book;