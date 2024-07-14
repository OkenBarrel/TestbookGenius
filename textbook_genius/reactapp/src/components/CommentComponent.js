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
        let response=await fetch("http://8.130.18.80:80/api/get-useBook"+"?isbn="+isbn);
        if(!response.ok){
            console.log("get relations wrong!!");
            return;
        }
        let data=await response.json();
        setRelations(data);
        // setIds(data?.usebook_id)
        // console.log(ids)
        // console.log(ids)
    }
    return(
        <Box sx={{display:'flex',flexDirection:'row'}}>
            <Card>
                <Tabs 
                    value={value} onChange={handleChange}
                    variant="scrollable" scrollButtons="auto"
                >
                    {relations.map((relation)=>(
                        <Tab label={relation.course.course_name+"-"+relation.teacher}></Tab>
                    ))}
                
                </Tabs>
            </Card>

            {console.log(relations[value])}
            <ScoreComponent relation={relations[value]}></ScoreComponent>
        </Box>
    )
}

export default CommentComponet;