import React, { Component, useState,useEffect } from "react";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
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
    }
    return(
        <Box border="0px solid" width="100%" display="flex" justifyContent="center" alignItems="center">
            <Grid container xs={12} sm={12} md={12} width="100%" minHeight="200px" display="flex" justifyContent="center" alignItems="center" sx={{ border: "0px solid", width: '100%' }}>
                <Grid item xs={8} sm={8} md={8} justifyContent="center" alignItems="center" sx={{ border: "0px solid", width: '100%', height:'100%' }}>
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
                                        <Tab key={relation.course.course_name + "-" + relation.teacher} label={relation.course.course_name + "-" + relation.teacher} />
                                    ))}
                                </Tabs>
                            </Card>
                        </Grid>
                        <Grid item sx={{ width: '100%' }}>
                            <Card sx={{ border: "0px solid", height: "150px", width: '100%' }}>
                                {console.log(relations[value])}
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={4} sm={4} md={4} display="flex" justifyContent="center" alignItems="center" sx={{ border: "0px solid", width: '100%',height:'230px' }}> 
                    <ScoreComponent relation={relations[value]} />
                </Grid>
            </Grid>
        </Box>
    )
}

export default CommentComponet;