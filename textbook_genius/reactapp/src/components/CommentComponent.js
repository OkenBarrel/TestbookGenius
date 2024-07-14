import React, { Component, useState,useEffect } from "react";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { useParams, useNavigate } from 'react-router-dom';
import ScoreComponent from "./ScoreComponet";
import { getCookie } from './CSRFToken';
import {getCsrfToken} from "./CSRFToken";
import CommentIcon from '@mui/icons-material/Comment'; 

import {Button,TextField} from '@mui/material';

// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

const CommentComponet=({isbn})=>{

    const [value,setValue]=useState(0);
    const [relations,setRelations]=useState([]);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');


    const handleChange = (event, newValue) => {
        setValue(newValue);
        console.log('!?',value)
        // setPasson(relations[newValue])
        // console.log("passon"+passon)
        // console.log(relations[value]["course"]+"-"+relations[value]["teacher"]);
    };
    useEffect(()=>{
        getRelations();
            // if (relations.length > 0) 
        getComment(relations[value]?.id); // 使用第一个relation的id调用getComment
    },[]);

    async function getRelations(){
        let response=await fetch("http://localhost:8000/api/get-useBook"+"?isbn="+isbn);
        if(!response.ok){
            console.log("get relations wrong!!");
            return;
        }
        let data=await response.json();
        console.log('????',data);
        setRelations(data);
        console.log('????',data);
        // setIds(data?.usebook_id)
        // console.log(ids)
        // console.log(ids)
    }

  
    const getComment = async (relationId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/get-comment?usebook_id=${relationId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },

            });
            if (!response.ok) {
                throw new Error('网络响应错误');
            }
             // 检查响应类型
            const contentType = response.headers.get('Content-Type');
            console.log('响应的Content-Type:', contentType); // 打印contentType
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('响应不是有效的JSON格式');
            }
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('获取评论数据失败:', error);
        }
    };

    // 当relations或value变化时，获取新的评论数据
    useEffect(() => {
        if (relations.length > 0 && relations[value]) {
            const relationId = relations[value].id; // 假设每个relation对象都有一个id属性
            getComment(relationId);
        }
    }, [relations, value]);


    const createComment = async (commentText) => {
        // 确保relations数组不为空且value在有效范围内
         if (!relations.length || value < 0 || value >= relations.length) {
            console.error('无效的relations索引或relations为空');
            return;
        }
        
        // 尝试获取user_id和username
        const userId = getCookie('user_id');
        const username = getCookie('username');

        // 如果无法获取user_id或username，则跳转到登录界面
        if (!userId || !username) {
            window.location.href = 'http://localhost:8000/api/login'; 
            return;
        }

        const relationId = relations[value].id; // 使用当前选中的useBook关系的ID

        try {
            const response = await fetch('http://localhost:8000/api/create-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: userId,
                    usebook: relationId,
                    info: commentText,
                }),
            });

            if (!response.ok) {
                throw new Error('网络响应错误');
            }

            const newComment = await response.json();
            console.log(comments)
            setComments([...comments, newComment]); // 更新评论列表以包含新评论
            console.log(comments)
            setContent(''); // 清空输入框内容
        } catch (error) {
            console.error('创建评论失败:', error);
        }
    };
    
    return(
        <Box border="0px solid" width="100%" display="flex" justifyContent="center" alignItems="center">
            <Grid container xs={12} sm={12} md={12} width="100%" minHeight="200px" display="flex" justifyContent="center" alignItems="center" sx={{ border: "0px solid", width: '100%' }}>
                <Grid item style={{marginTop: '20px', width: '90%'}}> 
                    <Grid container direction='row' justifyContent="center" >
                        <Grid item align="left" >
                            <TextField
                                label="写下你的评论"
                                variant="outlined"
                                fullWidth
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />                                
                        </Grid>
                    <Grid item align="right" alignContent="center">
                        <Button variant="outlined" onClick={() => createComment(content)} sx={{height:"40px"}}>提交评论</Button>
                    </Grid>
                </Grid>
                </Grid><Grid item xs={7} sm={7} md={7} justifyContent="center" alignItems="center" sx={{ border: "0px solid", width: '100%', height:'100%' }}>
                    <Grid container direction="column" sx={{ width: '100%' }}>
                        <Grid item sx={{ width: '100%' }}>
                            <Card sx={{ border: "0px solid", width: '100%' }}>
                                <Tabs 
                                    value={value} 
                                    onChange={handleChange}
                                    variant="scrollable" 
                                    scrollButtons="auto"
                                >
                                    {relations.map((relation) => (
                                        <Tab label={relation.course.course_name+"-"+relation.teacher}></Tab>
                                    ))}
                                </Tabs>
                            </Card>
                        </Grid>
                        <Grid item sx={{ width: '100%', padding: '20px' }}>
                            <Card sx={{ border: "0px solid", minHeight: "200px", width: '100%' }}>
                                {console.log(relations[value])}
                                <CustomTabPanel value={value} index={value}>
                                    <Box sx={{ width: '100%', typography: 'body1' }}>
                                        <Grid container sx={{border: "0px dotted"}}>
                                            <List sx={{ width: '100%' }}>
                                                {comments.filter(comment => comment.relationId === relations.id).map((filteredComment, index) => (
                                                    <ListItem key={index} sx={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                                                        <Grid container direction="row" alignContent="center">
                                                            <Grid item alignContent="center">
                                                                <ListItemIcon>
                                                                    <CommentIcon />
                                                                </ListItemIcon>                                                                
                                                            </Grid>
                                                            <Grid item alignContent="center">
                                                                <Avatar alt="User Avatar" src={filteredComment.avatar} sx={{ width: 25, height: 25 }} />
                                                            </Grid>
                                                            <Grid item sx={{ marginLeft: '10px'}} alignContent="center">
                                                                <ListItemText primary={filteredComment.username} />
                                                            </Grid>
                                                            <Grid item sx={{ marginLeft: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '80%' }} alignContent="center" justifyContent="center">
                                                                <ListItemText primary={filteredComment.info} />
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Grid>
                                    </Box>
                                </CustomTabPanel>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={4} sm={4} md={4} justifyContent="center" sx={{ marginLeft:"10px", border: "0px solid", width: '100%',Height:'300px' }}> 
                    <ScoreComponent relation={relations[value]} />
                </Grid>

            </Grid>
        </Box>
    )
}

export default CommentComponet;