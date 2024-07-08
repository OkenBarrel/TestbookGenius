import {Button,TextField,Grid, FormControl,FormHelperText, CardContent, CardMedia} from '@mui/material';
import {Box,OutlinedInput} from '@mui/material';
import {Select, MenuItem,InputLabel,Card} from '@mui/material'

import { useState,useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { getCsrfToken } from './CSRFToken';


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
    
    const navigate=useNavigate();

    const csrftoken = getCsrfToken();
    

    async function handleSearchButton(){
        let response= await fetch("/api/get-douban-book"+"?isbn="+isbn)
        if(!response.ok){
            setIsbnError(response.statusText);
            return;
        }
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
        let response=await fetch("/api/create-book",requestOption)
        if(!response.ok){
            setRelationError(response.statusText);
            return;
        }
        let data=await response.json();
        navigate('/book/'+isbn);
        // response.then((response)=>{
        //     if(!response.ok){
        //         setRelationError(response.statusText)
        //     }
        //     response.json()})
        // .then((data)=>navigate('/book/'+data.isbn));

    };

    return(
        <div className='createBookPage'>
            <Box sx={{ display:'flex',flexDirection: 'row' }}>
                <Card>
                    <Box sx={{ display:'flex',flexDirection: 'row' }}>
                        <CardContent>
                            <Grid container spacing={1} item xs={6} >
                                <Grid item xs={12} align="center">
                                    <h1>This is create book</h1>
                                </Grid>
                                <Grid item xs={12} align="center">
                                    <TextField label={'输入ISBN号,获取书籍信息'} onChange={(e)=>{setIsbn(e.target.value)}}></TextField>
                                    {/* <FormControl  error={isbnError==""? false:true}variant="outlined">
                                        <InputLabel htmlFor="isbn-input">isbn</InputLabel>
                                        <OutlinedInput
                                            id="isbn-input"
                                            onChange={(e) => { setIsbn(e.target.value) }}
                                            label="ISBN"
                                        />
                                        <FormHelperText>输入ISBN号,获取书籍信息</FormHelperText>*/}
                                    <Button variant="contained" onClick={handleSearchButton}>搜索</Button>
                                    {/* </FormControl>  */}
                                    {/* <p style={{ color: 'red' }}>{error}</p> */}
                                    
                                </Grid>
                                <Grid item xs={12} align="center">
                                    {/* <TextField value={title} label={"标题"} onChange={(e)=>{setTitle(e.target.value)}}/> */}
                                    <FormControl  variant="outlined">
                                        <InputLabel htmlFor="title-input">标题</InputLabel>
                                        <OutlinedInput
                                            id="title-input"
                                            value={title}
                                            onChange={(e) => { setTitle(e.target.value) }}
                                            label="标题"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} align="center">
                                    {/* <TextField value={author} label={"作者"} onChange={(e)=>{setAuthor(e.target.value)}}/> */}
                                    <FormControl  variant="outlined">
                                        <InputLabel htmlFor="author-input">作者</InputLabel>
                                        <OutlinedInput
                                            id="author-input"
                                            value={author}
                                            onChange={(e) => { setAuthor(e.target.value) }}
                                            label="作者"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} align="center">
                                {/* <TextField value={publisher} label={"出版社"} onChange={(e)=>{setPublisher(e.target.value)}}/> */}
                                    <FormControl  variant="outlined">
                                        <InputLabel htmlFor="publisher-input">出版社</InputLabel>
                                        <OutlinedInput
                                            id="publisher-input"
                                            value={publisher}
                                            onChange={(e) => { setPublisher(e.target.value) }}
                                            label="出版社"
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardMedia
                        component="img"
                        image={cover}
                        title='cover'
                        />
                    </Box>
                </Card>
                <Box>
                <Grid container spacing={1} item xs={6} >
                    <Grid item xs={12} align="center">
                        <h1>This is create Use</h1>
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
                    {/* <Grid item xs={12} align="center">
                        <FormControl  variant="outlined">
                            <InputLabel htmlFor="teacher-input">老师</InputLabel>
                            <OutlinedInput
                                id="teacher-input"
                                value={teacher}
                                onChange={(e) => { setTeacher(e.target.value) }}
                                label="老师"
                            />
                        </FormControl>
                    </Grid> */}
                    <Grid item xs={12} align="center">
                        {/* <TextField value={course} label={"课程"} onChange={(e)=>{setCourse(e.target.value)}}/> */}
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
                    {/* <TextField value={department} label={"学部"} onChange={(e)=>{setDepartment(e.target.value)}}/> */}
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="department-input">学部</InputLabel>
                            <OutlinedInput
                                id="department-input"
                                value={department}
                                onChange={(e) => { setDepartment(e.target.value) }}
                                label="学部"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} align="center">
                    {/* <TextField value={school_year} label={"学年"} onChange={(e)=>{setSchoolyear(e.target.value)}}/> */}
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="school-year-input">学年</InputLabel>
                            <OutlinedInput
                                id="school-year-input"
                                value={school_year}
                                onChange={(e) => { setSchoolyear(e.target.value) }}
                                label="学年"
                            />
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
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
                            {/* <FormHelperText>With label + helper text</FormHelperText> */}
                        </FormControl>
                        <Button variant="contained" onClick={handleSubmit}>创建</Button>
                    </Grid>
                    </Grid>
                </Box>
            </Box>
        </div>
    );
}

export default CreateBookPage;