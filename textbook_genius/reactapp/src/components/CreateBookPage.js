import {Button,TextField,Grid, FormControl,FormHelperText, CardContent, CardMedia, Link, Avatar} from '@mui/material';
import {Box,OutlinedInput,Alert} from '@mui/material';
import {Select, MenuItem,InputLabel,Card} from '@mui/material'
import Typography from '@mui/material/Typography';


import { useState,useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { getCsrfToken } from './CSRFToken';
import SchoolYearSelect from './SelectSchoolYear';
import { getCookie } from './CSRFToken';
import Home from './Navigate';
import HelloComponent from './HelloComponent';
import Search from './Search';

function CreateBookPage(props){

    const[isbn,setIsbn]=useState(0);
    // const[info,setInfo]=useState("");
    const[title,setTitle]=useState("");
    const[author,setAuthor]=useState("");
    const[cover,setCover]=useState("");
    const[douban_url,setDouban]=useState("");
    const[publisher,setPublisher]=useState("");
    const[pubdate,setPubdate]=useState("");
    const[relationError,setRelationError]=useState("");
    const[teacher,setTeacher]=useState("");
    const[course,setCourse]=useState("");
    const[department,setDepartment]=useState("");
    const[school_year,setSchoolyear]=useState("");
    const[semester,setSemester]=useState("");
    const[isbnError,setIsbnError]=useState("");
    const[user_id,setId]=useState(null);
    const[user_name,setName]=useState(null);
    const[avatar_url,setUrl]=useState(null);

    // const[doubanError,setDoubanError]=useState("");
    
    const navigate=useNavigate();

    const csrftoken = getCsrfToken();

    // useEffect(()=>{
    //     console.log(school_year)
    // },[school_year]);
    
    const getLog=async ()=>{
        let response=await fetch("http://192.168.225.149:8000/api/is-loggedin",{
          credentials:'include'
        });
        let data=await response.json()
        setUrl(data.avatar_url)
    }
    

    useEffect(()=>{
        getLog();
        setName(getCookie('username'));
        setId(getCookie('user_id'));
        if(getCookie('username')==null){
            navigate('/login',{replace:true,state:{from:'createBook'}})
        }
    },[])

    async function handleSearchButton(){
        console.log("username: "+getCookie('username'))
        // if(getCookie('username')==null){
        //     navigate('/login',{state:{from:'createBook'}})
        //     return;
        // }
        if(isbn.length !=13){
            setIsbnError("ISBN无效，请重新输入");
            return;
        }
        let response= await fetch("http://192.168.225.149:80/api/get-douban-book"+"?isbn="+isbn,{
            method: 'GET', // 可以是 'POST', 'PUT' 等其他 HTTP 方法
            credentials: 'include', // 确保在跨域请求中发送凭证
        })
        if(!response.ok){
            setIsbnError(response.msg);
            return;
        }
        setIsbnError("");
        await response.json()
        .then((data)=>{setTitle(data.title);
            setAuthor(data.author);
            setCover(data.images.small);
            setDouban(data.alt);
            setPublisher(data.publisher);
            setPubdate(data.pubdate);

            })
    }
    async function handleSubmit(){
        console.log("handling submit")

        if(isbn.length !=13){
            setIsbnError("ISBN无效，请重新输入");
            return;
        }
        if(!isbn||!title||!author||!pubdate||!cover||!douban_url||!teacher||!course||!department||!school_year||!semester){
            setRelationError("请将信息填写完整");
            return;
        }
        const requestOption={
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            body:JSON.stringify({
                book:{isbn:isbn,
                    title:title,
                    author:author,
                    publisher:publisher,
                    pubdate:pubdate,
                    cover:cover,
                    douban_url:douban_url},
                teacher:{
                    teacher_name:teacher
                },
                course:{
                    course_name:course,
                    department:department
                },
                school_year:school_year,
                semester:semester
            }),
        };
        let response=await fetch("http://192.168.225.149:80/api/create-book",requestOption)
        let data=await response.json();
        if(!response.ok){
            setRelationError(data.msg);
            return;
        }
        setRelationError("");
        navigate('/book/'+isbn);

    };

    return(
        <div className='createBookPage'>
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
                <Grid container alignItems="center" justifyContent="center" marginTop="30px">
                    <Card sx={{width:"60%"}}>
                        <Grid item width="100%" justifyContent="center">
                            <Box alignContent="center" sx={{ display:'flex',flexDirection: 'row'}}>
                                <Grid container width="100%" sx={{border:'0px solid', justifyContent:'space-evenly'}}>
                                    <Grid item width="30%" sx={{border:'0px solid'}}>
                                        <Box sx={{width:'100%', height:'100%' , border: '0px dashed grey'}}>
                                            <Grid container>
                                                <Grid item xs={12} align="center">
                                                    <h1>创建课本</h1>
                                                </Grid>
                                                <Grid item xs={12} align="center" sx={{marginBottom: '10px'}}>
                                                    <Grid container alignContent="center" justifyContent="center">
                                                        <TextField label={'输入ISBN号,获取书籍信息'} onChange={(e)=>{setIsbn(e.target.value)}}></TextField>
                                                        <Grid item alignContent="center" justifyContent="center" marginLeft="10px">
                                                            <Button variant="contained" onClick={handleSearchButton} sx={{maxHeight:'50px'}}>搜索</Button>                                                    
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} align="center" sx={{marginBottom: '10px'}}>
                                                    <FormControl  variant="outlined">
                                                        <InputLabel htmlFor="teacher-input">老师</InputLabel>
                                                        <OutlinedInput
                                                            id="teacher-input"
                                                            value={teacher}
                                                            onChange={(e) => { setTeacher(e.target.value) }}
                                                            label="老师"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} align="center" sx={{marginBottom: '10px'}}>
                                                    <FormControl  variant="outlined">
                                                        <InputLabel htmlFor="course-input">课程</InputLabel>
                                                        <OutlinedInput
                                                            id="course-input"
                                                            value={course}
                                                            onChange={(e) => { setCourse(e.target.value) }}
                                                            label="课程"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} align="center" sx={{marginBottom: '10px'}}>
                                                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                                                    <InputLabel id="demo-simple-select-helper-label">学部</InputLabel>
                                                        <Select
                                                        labelId="demo-simple-select-helper-label"
                                                        id="demo-simple-select-helper"
                                                        value={department}
                                                        label="学部"
                                                        onChange={(e)=>{setDepartment(e.target.value)}}
                                                        >
                                                        <MenuItem value={"理学部"}>理学部</MenuItem>
                                                        <MenuItem value={"信息学部"}>信息学部</MenuItem>
                                                        <MenuItem value={"文法学部"}>文法学部</MenuItem>
                                                        <MenuItem value={"经管学部"}>经管学部</MenuItem>
                                                        <MenuItem value={"环生学部"}>环生学部</MenuItem>
                                                        <MenuItem value={"城建学部"}>城建学部</MenuItem>
                                                        <MenuItem value={"材制学部"}>材制学部</MenuItem>
                                                        <MenuItem value={"艺设学院"}>艺设学院</MenuItem>
                                                        <MenuItem value={"马克思学院"}>马克思学院</MenuItem>
                                                        <MenuItem value={"素质教育学院"}>素质教育学院</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} align="center" sx={{marginBottom: '10px'}}>
                                                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
                                                        <SchoolYearSelect onChange={(e)=>{setSchoolyear(e.target.value)}} value={school_year}/>
                                                    </FormControl>
                                                    <FormControl sx={{ m: 1, minWidth: 140 }}>
                                                        <InputLabel id="demo-simple-select-helper-label">学期</InputLabel>
                                                        <Select
                                                        labelId="demo-simple-select-helper-label"
                                                        id="demo-simple-select-helper"
                                                        value={semester}
                                                        label="学期"
                                                        onChange={(e)=>{setSemester(e.target.value)}}
                                                        >
                                                        <MenuItem value={1}>1-秋季学期</MenuItem>
                                                        <MenuItem value={2}>2-春季学期</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    <Button variant="contained" onClick={handleSubmit}>创建</Button>
                                                    {relationError && <Alert severity="error" style={{ marginTop: 20 }}>{relationError}</Alert>}
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                    <Grid item width="30%" height="100%" sx={{border:'0px solid'}}>
                                        <Box height="100%">
                                            <Box height="100%" sx={{ display:'flex',flexDirection: 'row',minWidth:300}}>
                                                <Grid container direction="column" justifyContent="space-evenly">
                                                    <Grid item>
                                                        <CardContent>
                                                            <Grid container minWidth='200px' alignContent="center" justifyContent="left" sx={{border:'0px solid'}}>
                                                                <Grid item xs={12}>
                                                                    <Typography variant='h6'>书名：{title}</Typography>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Typography variant='h6'>作者：{author}</Typography>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Typography variant='h6'>出版社：{publisher}</Typography>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Typography variant='h6'>出版日期：{pubdate}</Typography>
                                                                </Grid>
                                                            </Grid>
                                                            {isbnError && <Alert severity="error" style={{ marginTop: 20 }}>{isbnError}</Alert>}
                                                        </CardContent>                                                    
                                                    </Grid>
                                                    <Grid item sx={{marginBottom: "30px"}}>
                                                        {cover && (<img src={`http://192.168.225.149:8000/api/proxy-image?url=${encodeURIComponent(cover)}`} crossOrigin="anonymous" referrer="same-origin"></img>)}
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Box>                                    
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>                        
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default CreateBookPage;