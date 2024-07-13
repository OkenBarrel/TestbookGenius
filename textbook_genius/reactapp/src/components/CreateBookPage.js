import {Button,TextField,Grid, FormControl,FormHelperText, CardContent, CardMedia} from '@mui/material';
import {Box,OutlinedInput,Alert} from '@mui/material';
import {Select, MenuItem,InputLabel,Card} from '@mui/material'
import Typography from '@mui/material/Typography';


import { useState,useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { getCsrfToken } from './CSRFToken';
import SchoolYearSelect from './SelectSchoolYear';
import { getCookie } from './CSRFToken';


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

    // const[doubanError,setDoubanError]=useState("");
    
    const navigate=useNavigate();

    const csrftoken = getCsrfToken();

    // useEffect(()=>{
    //     console.log(school_year)
    // },[school_year]);
    

    async function handleSearchButton(){
        console.log("username: "+getCookie('username'))
        if(getCookie('username')==null){
            navigate('/login',{state:{from:'createBook'}})
            return;
        }
        if(isbn.length !=13){
            setIsbnError("ISBN无效，请重新输入");
            return;
        }
        let response= await fetch("http://localhost:8000/api/get-douban-book"+"?isbn="+isbn)
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
        let response=await fetch("http://localhost:8000/api/create-book",requestOption)
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
            <Box  alignContent="center" sx={{ display:'flex',flexDirection: 'row'}}>
                <Box sx={{width:600,p: 2, border: '1px dashed grey'}}>{/*minWidth:400,maxWidth:400*/}
                <Grid container spacing={1} item xs={6} >
                    <Grid item xs={12} align="center">
                        <h1>This is create Use</h1>
                    </Grid>
                    <Grid item xs={12} align="center">
                                    <TextField label={'输入ISBN号,获取书籍信息'} onChange={(e)=>{setIsbn(e.target.value)}}></TextField>
                                    <Button variant="contained" onClick={handleSearchButton}>搜索</Button>
                                </Grid>
                    <Grid item xs={12} align="center">
                    {/* <TextField value={teacher} label={"老师"} onChange={(e)=>{setTeacher(e.target.value)}}/> */}
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
                    
                    <Grid item xs={12} align="center">
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
                    <Grid item xs={12} align="center">
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
                    <Grid item xs={12} align="center">
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
                <Card >
                    <Box sx={{ display:'flex',flexDirection: 'row',minWidth:300}}>
                        <CardContent>
                            <Grid container spacing={1} item xs={12} >
                                <Grid item xs={12} >{/*align="center"*/}
                                    <h1>This is create book</h1>
                                </Grid>
                                <Grid item xs={12}>
                                    {/* <TextField value={title} label={"标题"} onChange={(e)=>{setTitle(e.target.value)}}/> */}
                                    {/* <FormControl  variant="outlined">
                                        <InputLabel htmlFor="title-input">标题</InputLabel>
                                        <OutlinedInput
                                            id="title-input"
                                            value={title}
                                            onChange={(e) => { setTitle(e.target.value) }}
                                            label="标题"
                                        />
                                    </FormControl> */}
                                    <Typography variant='h3'>书名：{title}</Typography>

                                </Grid>
                                <Grid item xs={12}>
                                    {/* <TextField value={author} label={"作者"} onChange={(e)=>{setAuthor(e.target.value)}}/> */}
                                    {/* <FormControl  variant="outlined">
                                        <InputLabel htmlFor="author-input">作者</InputLabel>
                                        <OutlinedInput
                                            id="author-input"
                                            value={author}
                                            onChange={(e) => { setAuthor(e.target.value) }}
                                            label="作者"
                                        />
                                    </FormControl> */}
                                    <Typography variant='h6'>作者：{author}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                {/* <TextField value={publisher} label={"出版社"} onChange={(e)=>{setPublisher(e.target.value)}}/> */}
                                    {/* <FormControl  variant="outlined">
                                        <InputLabel htmlFor="publisher-input">出版社</InputLabel>
                                        <OutlinedInput
                                            id="publisher-input"
                                            value={publisher}
                                            onChange={(e) => { setPublisher(e.target.value) }}
                                            label="出版社"
                                        />
                                    </FormControl> */}
                                    <Typography variant='h6'>出版社：{publisher}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    {/* <FormControl  variant="outlined"> */}
                                        {/* <InputLabel htmlFor="publisher-input">{出版日期}</InputLabel>
                                        <OutlinedInput
                                            id="publisher-input"
                                            value={pubdate}
                                            onChange={(e) => { setPubdate(e.target.value) }}
                                            label="出版日期"
                                        />
                                    </FormControl> */}
                                    <Typography variant='h6'>出版日期：{pubdate}</Typography>
                                </Grid>
                            </Grid>
                            {isbnError && <Alert severity="error" style={{ marginTop: 20 }}>{isbnError}</Alert>}
                        </CardContent>
                        <CardMedia
                        component="img"
                        image={cover}
                        title='cover'
                        />
                    </Box>
                </Card>
            </Box>
        </div>
    );
}

export default CreateBookPage;