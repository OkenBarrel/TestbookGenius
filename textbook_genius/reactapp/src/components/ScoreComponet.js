import {Button,DialogContent,Grid,Typography,Box,Card, CardContent} from '@mui/material';
import React,{useEffect,useState} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import {ContrastRounded, DeleteIcon} from'@mui/icons-material';
import { styled } from '@mui/material/styles';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { getCsrfToken,getCookie } from './CSRFToken';

const ScoreComponent=({relation})=>{
    const [course,setCourse]=useState("");
    const [teacher,setTeacher]=useState("");
    const [yes,setYes]=useState(false);
    const [no,setNo]=useState(false);

    const csrftoken=getCsrfToken();
    // const up=true,down=false;
    // const yesColor,noColor;


    useEffect(()=>{
        console.log(relation);
        setCourse(relation?.course?.course_name);
        setTeacher(relation?.teacher);
        // if(up){
        //     setYes(true);
        // }
        // if(no){
        //     setNo(true)
        // }
    },[relation])

    const handleRequest = async (url, method, body) => {
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
    };

    async function handleYes(){
        console.log("yes");
        if(no){
            return;
        }
        // const yesColor = yes&&!no ? "#f44336" : "default"; 
        const body = { 
            usebook: relation?.id
        };
        if (yes) {
            // 取消点赞
            console.log("yes"+yes);
            const success = await handleRequest("http://8.130.18.80:8000/api/up-score-user", "DELETE", body);
            if (success) {
                setYes(false);
            }
        } else {
            // 进行点赞
            console.log("yes"+yes);
            const success = await handleRequest("http://8.130.18.80:8000/api/up-score-user", "POST", body);
            if (success) {
                setYes(true);
            }
        }

    };


    async function handleNo(){
        // const noColor=no&&!yes? "#0097a7":"default";
        console.log('no');
        if(yes){
            return;
        }
        const body = { 
            usebook: relation?.id
        };
        if(no){
            // 取消点踩
            const success = await handleRequest("http://8.130.18.80:8000/api/down-score-user", "DELETE", body);
            if (success) {
                setNo(false);
            }
        }else{
            //进行点踩
            const success = await handleRequest("http://8.130.18.80:8000/api/down-score-user", "POST", body);
            if (success) {
                setNo(true);
            }
        }

    };
    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 30,//宽度
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: theme.palette.mode === 'light' ? '#308fe8' : '#308fe8',
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,//圆头弧度 0直
          backgroundColor: theme.palette.mode === 'light' ? '#f44334' : '#308fe8',
        },
      }));

    return(
        
        <Card sx={{width:200,height:200}}>
            <CardContent>
                {/* {console.log(course)} */}
                <Typography variant="h6"> {course}-{teacher}</Typography>
                <BorderLinearProgress variant="determinate" value={relation?.downvote_count==0&&relation?.upvote_count==0 ? 0:relation?.upvote_count/relation?.downvote_count+relation?.upvote_count} />
                <Tooltip title="实用">
                    <IconButton onClick={handleYes}>
                        <ThumbUpIcon variant="contained" style={{ color: yes ? "#f44336" : "#353838" }}/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="不实用">
                    <IconButton onClick={handleNo}>
                        <ThumbDownIcon variant="contained" style={{ color: no ? "#0097a7" : "#353838" }}/>
                    </IconButton>
                </Tooltip>
                
            </CardContent>
        </Card>
    );

}
export default ScoreComponent;