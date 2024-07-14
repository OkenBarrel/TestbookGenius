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
import Home from "./Navigate"
import ScoreComponent from "./ScoreComponet";
import { getCookie } from './CSRFToken';
import { getCsrfToken } from './CSRFToken';
import HelloComponent from "./HelloComponent";
import Search from "./Search";

const openNewTab = (url) =>{
    window.open(url,'_blank');
}

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
    const[userid,setUserId]=useState('')
    const[username,setUserName]=useState('')

    const[relationerror,setRelationError]=useState('')

    const navigate=useNavigate();
    const csrftoken=getCsrfToken();

    useEffect(() => {
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

    }

    useEffect(()=>{
        console.log(relation);
        getMarkDetail(relation?.id);
    },[relation])

    const getMarkDetail =async ()=>{
        let response=await fetch("http://127.0.0.1:8000/api/mark-book");
        if(!response.ok){
            return;
        }
        let data=await response.json();
        setMark(data?.isMark);
        

    };

    const handleRequest = async (url, method, body) => {
        let requestOption = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            credentials: 'include',
            body: JSON.stringify(body)
        };
        let response = await fetch(url, requestOption);
        if (!response.ok) {
            console.log(`${method} request failed`);
            return false;
        }
        return true;
    };

    async function handleMark(){
        console.log("mark");
        const body ={
            userid:userid,
            bookisbn:isbn
        };
        if (mark) {
            // 取消收藏
            console.log("取消收藏")
            const success = await handleRequest("http://localhost:8000/api/mark-book", "DELETE", body);
            if (success) {
                setMark(false);
            }
        } else {
            // 进行收藏
            console.log("进行收藏")
            const success = await handleRequest("http://localhost:8000/api/mark-book", "POST", body);
            if (success) {
                setMark(true);
            }     
        }
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

    /*async function handleMark(){
        console.log('mark')
        if (mark) {
            // 取消收藏
            setMark(false);
            setUserId(getCookie('user_id'))
            setUserName(getCookie('username'))

            const requestOption={
                method:"DELETE",
                headers:{
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken
                },
                body:JSON.stringify({
                    mark:{
                        userid:userid,
                        bookisbn:isbn
                    }
                })
            };
            let response=await fetch("http://localhost:8000/api/mark-book",requestOption)
            let data=await response.json();
            if(!response.ok){
                setRelationError(data.msg);
                return;
            }
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
                })
            };
            let response=await fetch("http://localhost:8000/api/mark-book",requestOption)
            let data=await response.json();
            if(!response.ok){
                setRelationError(data.msg);
                return;
            }
            
        }
    }*/

    return(
        <div>
            <Grid container spacing="10px" sx={{display:'flex',alignItems:'center', flexDirection:'column'}}>
                <Grid item width = "100%">
                    <Box border = "0px dotted #acf" width = "100%">
                        <Grid container spacing={0} sx={{display:'flex', flexDirection:'row'}} style={{ marginTop: '5px'}}>
                            <Grid item xs={7} sm={7} md={7} align="left" style={{ marginLeft: '5%' }}>
                                <Home />
                            </Grid>
                            <Grid item xs={3.8} sm={3.8} md={3.8} align="right" style={{ marginRight: '5%'}}>
                                <HelloComponent />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid width = "90%" style={{ marginTop: '5px'}}>
                    <Search/>
                </Grid>
                <Grid item xs={12} align="center">
                    <h1>{title}</h1>
                </Grid>
                <Grid item width ="90%">
                    <Card variant="outlined"  align="center" jutifyContent="center" sx={{display:"flex",maxHeight: 400}}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: '1 0 auto' }}>
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
                                    <Grid item spacing={2} xs={12} align="Left">
                                        <Button variant='contained' to="./update" component={Link}>修改书籍信息</Button>
                                        <Tooltip title="收藏书籍">
                                            <IconButton type="button" onClick={handleMark}>
                                                <StarIcon variant="contained" style={{ color: mark ? "#ffcc00" : "#353838" }}/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
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
                                    <Button variant="contained" onClick={() => openNewTab(buy_dang)}>当当网购买</Button>
                                </Grid>
                                <Grid item xs={12} align="center">
                                    <Button variant="contained" onClick={() => openNewTab(buy_bookchina)}>中国图书网购买</Button>
                                </Grid>
                                <Grid item xs={12} align="center">
                                    <Button variant="contained" onClick={() => openNewTab(buy_kong)}>孔夫子旧书网购买</Button>
                                </Grid>
                                <Grid item xs={12} align="center">
                                    <Button variant="contained" onClick={() => openNewTab(buy_jie)}>旧书街购买</Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Card>
                </Grid>
                <Grid item>
                    <Box alignContent="center" style={{ marginTop: '5px'}}>
                        <CommentComponet isbn={isbn}/>
                    </Box>
                </Grid>
            </Grid>

            

            
        </div>
    );

}
export default Book;