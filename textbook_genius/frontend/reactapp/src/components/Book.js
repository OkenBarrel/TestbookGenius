import React, { Component, useState,useEffect } from "react";
import {Button,DialogContent,TextField} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
// import CreateBookPage from "./CreateBookPage";

const Book=()=>{
    const { isbn } = useParams();
    const [title,setTitle]=useState("");
    const[author,setAuthor]=useState("");
    const[cover,setCover]=useState("");
    const[douban_url,setDouban]=useState("")
    const[publisher,setPublisher]=useState("")
    const[pubdate,setPubdate]=useState("")
    const navigate=useNavigate();

    useEffect(() => {
        console.log(isbn);
        getBookDetails();
      }, []);

    async function getBookDetails(){
        let res=await fetch("/api/get-book"+"?isbn="+isbn)
        if(!res.ok){
            navigate("/");
        }
        let data=await res.json()
        setTitle(data.title)
        // .then((response)=>{
        //     return response.json();
        // })
        // .then((data)=>{
        //     setTitle(data.title)
        // })
    }

    return(
        <div>
            <h2>This is Book {title}</h2>
            
        </div>
    );

}
export default Book;