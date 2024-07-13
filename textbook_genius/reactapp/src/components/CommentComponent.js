import React, { Component, useState,useEffect } from "react";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card'
import { useParams, useNavigate } from 'react-router-dom';
import ScoreComponent from "./ScoreComponet";

const CommentComponet=({isbn})=>{

    const [value,setValue]=useState(0);
    const [relations,setRelations]=useState([]);
    const [comments, setComments] = useState([]);


    const handleChange = (event, newValue) => {
        setValue(newValue);
        // setPasson(relations[newValue])
        // console.log("passon"+passon)
        // console.log(relations[value]["course"]+"-"+relations[value]["teacher"]);
    };
    useEffect(()=>{
        getRelations();
    },[]);

    async function getRelations(){
        let response=await fetch("http://localhost:8000/api/get-useBook"+"?isbn="+isbn);
        if(!response.ok){
            console.log("get relations wrong!!");
            return;
        }
        let data=await response.json();
        setRelations(data);
        // setIds(data?.usebook_id)
        // console.log(ids)
        // console.log(ids)
        if(data.length > 0) {
            getComment(data[0].id); // 直接使用第一个relation的id调用getComment
        }
    }
  
    const getComment = async (relationId) => {
        try {
            const response = await fetch(`api/get-comment/${relationId}`);
            if (!response.ok) {
                throw new Error('网络响应错误');
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
    
    return(
        <Box sx={{display:'flex',flexDirection:'row'}}>
            <Card>
                <Tabs 
                    value={value} onChange={handleChange}
                    variant="scrollable" scrollButtons="auto"
                >
                    {relations.map((relation)=>(
                        <Tab key={relation.id} label={relation.course.course_name+"-"+relation.teacher}></Tab>
                    ))}
                
                </Tabs>
            </Card>

            <ScoreComponent relation={relations[value]}></ScoreComponent>
            {/* 显示当前选中关系的评论 */}
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <ul>
                    {comments.map((comment, index) => (
                        <li key={index}>{comment.content}</li> // 假设每个评论对象都有一个content属性
                    ))}
                </ul>
            </Box>
        </Box>
    )
}

export default CommentComponet;