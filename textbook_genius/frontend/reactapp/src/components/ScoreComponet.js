import {Button,DialogContent,Grid,Typography,Box,Card, CardContent} from '@mui/material';
import React,{useEffect,useState} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import {DeleteIcon} from'@mui/icons-material';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

function ScoreComponent({relationAndScore}){

    function handleYes(){
        console.log("yes");

    };

    function handleNo(){
        console.log('no');

    };
    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 20,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
        },
      }));

    return(
        <Card sx={{width:200,height:200}}>
            <CardContent>
                <Typography variant="h1">This is the Scoring of {relation}</Typography>
                <BorderLinearProgress variant="determinate" value={30} />

                <Button variant="contained" onClick={handleYes}>推荐</Button>
                <Button variant="contained" onClick={handleNo}>不推荐</Button>
            </CardContent>
        </Card>
    );

}
export default ScoreComponent;