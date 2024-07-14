import React, { Component, useState,useEffect } from "react";
import {Button,Grid,Card,Box, CardContent,CardMedia,Avatar} from '@mui/material';
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


    const navigate=useNavigate();
    const csrftoken=getCsrfToken();

    const[user_id,setId]=useState(null);
    const[user_name,setName]=useState(null);
    const[avatar_url,setUrl]=useState(null);

    
  
  
    const getLog=async ()=>{
      let response=await fetch("http://192.168.225.149:80/api/is-loggedin",{
        credentials:'include'
      });
      let data=await response.json()
      setUrl(data.avatar_url)
  
    }

    useEffect(() => {
        getBookDetails();
        getLog();
        setName(getCookie('username'));
        setId(getCookie('user_id'));
        //setUserName(getCookie('username'))
    }, []);

    async function getBookDetails(){
        let res=await fetch("http://192.168.225.149:80/api/get-book"+"?isbn="+isbn)
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
        setId(getCookie('user_id'))
        
        //setUserName(getCookie('username'))
        getMarkDetail(relation?.id);
    },[relation])


    const getMarkDetail =async ()=>{

        let response=await fetch("http://192.168.225.149:80/api/get-mark-status"+"?userid="+getCookie('user_id')+"&bookisbn="+isbn,{
            credentials:'include'
        });
        if(!response.ok){
            return;
        }
        let data=await response.json();
        setMark(data?.ismark);

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
            userid:user_id,
            bookisbn:isbn
        };
        if (mark) {
            // 取消收藏
            console.log("取消收藏")
            const success = await handleRequest("http://192.168.225.149:80/api/mark-book", "DELETE", body);
            if (success) {
                setMark(false);
            }
        } else {
            // 进行收藏
            console.log("进行收藏")
            const success = await handleRequest("http://192.168.225.149:80/api/mark-book", "POST", body);
            if (success) {
                setMark(true);
            }     
        }
    }

    return(
        <div>
            <Grid container sx={{display:'flex',alignItems:'center', flexDirection:'column'}}>
                <Grid item width="100%">
                    <Box width="90%" display="flex" justifyContent="right" sx={{marginTop: '20px', marginLeft: '5%', marginRight: '5%' }}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item align="left">
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
                <Grid width = "90%" style={{ marginTop: '5px'}}>
                    <Search/>
                </Grid>
                <Grid item xs={12} align="center">
                    <h1>{title}</h1>
                </Grid>
                <Grid item width="90%">
                    <Card variant="outlined" align="center" justifyContent="center" sx={{ display: "flex", minHeight: 350, padding: 5 }}>
                        <Grid item xs={4} sm={4} md={4}>
                            {cover && (
                                <CardMedia
                                    component="img"
                                    sx={{
                                        maxHeight: 350,
                                        objectFit: 'contain'
                                    }}
                                    image={`http://192.168.225.149:80/api/proxy-image?url=${encodeURIComponent(cover)}`}
                                    title="cover"
                                />
                            )}
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} marginTop="1%">
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                    <Grid container spacing={1} item xs={12} marginLeft="5%">
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                                                <h2>书名:</h2>
                                                <h2>{title}</h2>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                                                <p>作者:</p>
                                                <p>{author}</p>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                                                <p>出版社:</p>
                                                <p>{publisher}</p>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                                                <p>出版日期:</p>
                                                <p>{pubdate}</p>
                                            </Box>
                                        </Grid>
                                        <Grid item spacing={2} xs={12} align="left">
                                            <Button variant="contained" to="./update" component={Link}>修改书籍信息</Button>
                                            <Tooltip title="收藏书籍">
                                                <IconButton type="button" onClick={handleMark}>
                                                    <StarIcon variant="contained" style={{ color: mark ? "#ffcc00" : "#353838" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} marginTop="50px" alignContent="center">
                            <Box align="center" justifyContent="center" alignItems="flex-end" sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <Grid container direction="column" width="100%" spacing={2} justifyContent="space-between">
                                    <Box border="0px solid" width="100%" height="100%">
                                        <Grid item align="center" xs={12}>
                                            <Button variant="outlined" onClick={() => openNewTab(buy_dang)} sx={{ width: '90%', height: '50px', fontSize: '1.2rem' }}>当当网购买</Button>
                                        </Grid>
                                        <Grid item align="center" xs={12}>
                                            <Button variant="outlined" onClick={() => openNewTab(buy_bookchina)} sx={{ width: '90%', height: '50px', fontSize: '1.2rem' }}>中国图书网购买</Button>
                                        </Grid>
                                        <Grid item align="center" xs={12}>
                                            <Button variant="outlined" onClick={() => openNewTab(buy_kong)} sx={{ width: '90%', height: '50px', fontSize: '1.2rem' }}>孔夫子旧书网购买</Button>
                                        </Grid>
                                        <Grid item align="center" xs={12}>
                                            <Button variant="outlined" onClick={() => openNewTab(buy_jie)} sx={{ width: '90%', height: '50px', fontSize: '1.2rem' }}>旧书街购买</Button>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Box>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item justifyContent="center" width="90%">
                    <Box border="0px solid" justifyContent="center" style={{ marginTop: '5px', width: '100%'}}>
                        <CommentComponet isbn={isbn}/>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );

}
export default Book;