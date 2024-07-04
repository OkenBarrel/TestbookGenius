import React, { Component, useState,useEffect } from "react";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useParams, useNavigate } from 'react-router-dom';

const CommentComponet=()=>{
    const [value,setValue]=useState(0);
    const [relations,setRelations]=useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    return(
        <Box sx={{maxWidth:{xs:320,sm:480}}}>
            <Tabs 
                value={value} onChange={handleChange}
                variant="scrollable" scrollButtons="auto"
            >
                {relations.map((relation)=>(
                    <Tab label={relation.couse+"-"+relation.teacher}></Tab>
                ))}   
            
            </Tabs>

        </Box>
    )
}

export default CommentComponet;