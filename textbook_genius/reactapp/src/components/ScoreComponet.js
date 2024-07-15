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
    const [use_id,setUseId]=useState("");
    const [yes,setYes]=useState(false);
    const [no,setNo]=useState(false);
    const [user_id,setUserId]=useState('');
    const [yesCount,setYesCount]=useState(Number(0));
    const [NoCount,setNoCount]=useState(Number(0));
    

    const csrftoken=getCsrfToken();
    // const up=true,down=false;
    // const yesColor,noColor;


    useEffect(()=>{
        console.log('!!!!',relation);
        setCourse(relation?.course?.course_name);
        setTeacher(relation?.teacher);
        setUseId(relation?.id);
        setUserId(getCookie('user_id'));
        getUseDetail(relation?.id);
        
        // if(up){
        //     setYes(true);
        // }
        // if(no){
        //     setNo(true)
        // }
    },[relation])
    const getUseDetail=async (useid)=>{
        let response=await fetch("http://192.168.225.149:80/api/get-one-useBook"+"?use_id="+useid+"&user_id="+user_id);
        if(!response.ok){
            return;
        }
        let data=await response.json();
        setYes(data?.is_upvoted);
        setNo(data?.is_downvoted);
        setYesCount(data?.upvote);
        setNoCount(data?.downvote);

    };
    // useEffect(()=>{
    //     console.log(yesCount / (NoCount + yesCount));
    // },[yesCount,NoCount])

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

    async function handleYes(){
        // console.log("yes");
        if(no){
            return;
        }
        // const yesColor = yes&&!no ? "#f44336" : "default"; 
        const body = { 
            useBook: use_id,
            user_id: user_id
        };
        if (yes) {
            // 取消点赞
            // console.log("yes"+yes);
            const success = await handleRequest("http://192.168.225.149:80/api/up-score-user", "DELETE", body);
            if (success) {
                setYes(false);
                setYesCount(yesCount-1)
            }
        } else {
            // 进行点赞
            console.log("yes"+yes);
            const success = await handleRequest("http://192.168.225.149:80/api/up-score-user", "POST", body);
            if (success) {
                setYes(true);
                setYesCount(yesCount+1)
            }
        }
        console.log("yescount"+Number(yesCount));
        console.log("nocount"+Number(NoCount));
        console.log("per"+Number(yesCount) / (Number(NoCount) + Number(yesCount)));


    };


    async function handleNo(){
        // const noColor=no&&!yes? "#0097a7":"default";
        console.log('no');
        if(yes){
            return;
        }
        const body = { 
            useBook: use_id,
            user_id:user_id
        };
        if(no){
            // 取消点踩
            const success = await handleRequest("http://192.168.225.149:80/api/down-score-user", "DELETE", body);
            if (success) {
                setNo(false);
                setNoCount(NoCount-1)
            }
        }else{
            //进行点踩
            const success = await handleRequest("http://192.168.225.149:80/api/down-score-user", "POST", body);
            if (success) {
                setNo(true);
                setNoCount(NoCount+1)
            }
        }
        console.log("yescount"+Number(yesCount));
        console.log("nocount"+Number(NoCount));
        console.log("per"+Number(yesCount) / (Number(NoCount) + Number(yesCount)));

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
        
        <Card sx={{width:'100%',height:200}}>
            <CardContent>
                {/* {console.log(course)} */}
                <Box sx={{minWidth:200}}>
                    <Typography variant="h6" align="center">
                        {course} - {teacher}
                    </Typography>
                    <BorderLinearProgress 
                        variant="determinate" 
                        value={NoCount === 0 && yesCount === 0 
                                ? 0 
                                : Number(yesCount) / (Number(NoCount) + Number(yesCount)) * 100} 
                    />
                    <Box display="flex" flexDirection="row"  justifyContent="space-between" alignItems="center" mt={2}>
                        <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                            <Tooltip title="实用">
                                <IconButton  onClick={handleYes}>
                                    <ThumbUpIcon fontSize="large" style={{ color: yes ? "#f44336" : "#353838" }} />
                                </IconButton>
                            </Tooltip>
                            <Typography variant="h7">
                                实用
                            </Typography>
                            <Typography variant="caption">
                                {yesCount}
                            </Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                            <Tooltip title="不实用">
                                <IconButton onClick={handleNo}>
                                    <ThumbDownIcon fontSize="large" style={{ color: no ? "#0097a7" : "#353838" }} />
                                </IconButton>
                            </Tooltip>
                            <Typography variant="h7">
                                不实用
                            </Typography>
                            <Typography variant="caption">
                                {NoCount}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                
            </CardContent>
        </Card>
    );

}
export default ScoreComponent;