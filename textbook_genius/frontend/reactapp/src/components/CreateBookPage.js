import {Button,TextField,Grid,FormControl,InputLabel,OutlinedInput,FormHelperText} from '@mui/material';
import {Box,ThemeProvider} from '@mui/material';
import ScoreComponent from './ScoreComponet';

import { useState,useEffect } from 'react';
import {useNavigate} from 'react-router-dom';


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
    const[departmant,setDepartment]=useState("");
    const[school_year,setSchoolyear]=useState("");
    const[semester,setSemester]=useState("");
    const[isbnError,setIsbnError]=useState("");
    
    const navigate=useNavigate();

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
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({
                book:{isbn:isbn,
                    title:title,
                    author:author,
                    publisher:publisher,
                    pubdate:pubdate,
                    cover:cover,
                    douban_url:douban_url},
                teacher:teacher,
                course:{
                    course_name:course,
                    departmant:departmant
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
        navigate('/book/'+data.isbn);
        // response.then((response)=>{
        //     if(!response.ok){
        //         setRelationError(response.statusText)
        //     }
        //     response.json()})
        // .then((data)=>navigate('/book/'+data.isbn));

    };

    return(
        <div className='createBookPage'>
            {/* <TextField label={'输入ISBN号，获取书籍信息'} onChange={(e)=>{setIsbn(e.target.value)}}></TextField>
            <Button variant="contained" onClick={handleSearchButton}>搜索</Button>
            <form>
            <TextField value={title} label={"标题"} onChange={(e)=>{setTitle(e.target.value)}}/>
            <TextField value={author} label={"作者"} onChange={(e)=>{setAuthor(e.target.value)}}/>
            </form> */}
            <Grid container spacing={3} align="center" justifyContent="center">
                <Grid container spacing={1} item xs={6} >
                    <Grid item xs={12} align="center">
                        <h1>This is create Book</h1>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <FormControl  error={isbnError==""? false:true}variant="outlined">
                            <InputLabel htmlFor="isbn-input">isbn</InputLabel>
                            <OutlinedInput
                                id="isbn-input"
                                onChange={(e) => { setIsbn(e.target.value) }}
                                label="ISBN"
                            />
                            <FormHelperText>输入ISBN号，获取书籍信息</FormHelperText>
                            <Button variant="contained" onClick={handleSearchButton}>搜索</Button>
                        </FormControl>
                        {/* <p style={{ color: 'red' }}>{error}</p> */}
                        
                    </Grid>
                    <Grid item xs={12} align="center">
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
                    <Grid item xs={12} align="center">
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
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="department-input">学部</InputLabel>
                            <OutlinedInput
                                id="department-input"
                                value={departmant}
                                onChange={(e) => { setDepartment(e.target.value) }}
                                label="学部"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="school-year-input">学年</InputLabel>
                            <OutlinedInput
                                id="school-year-input"
                                value={school_year}
                                onChange={(e) => { setSchoolyear(e.target.value) }}
                                label="学年"
                            />
                        </FormControl>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="semester-input">学期</InputLabel>
                            <OutlinedInput
                                id="semester-input"
                                value={semester}
                                onChange={(e) => { setSemester(e.target.value) }}
                                label="学期"
                            />
                        </FormControl>
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