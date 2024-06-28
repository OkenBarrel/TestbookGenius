import React, { Component, useState,useEffect } from "react";
import {Button,DialogContent,TextField} from '@mui/material';
import { useParams, useHistory } from 'react-router-dom';
// import CreateBookPage from "./CreateBookPage";

const Book=()=>{
    const { isbn } = useParams();
    const [title,setTitle]=useState("");

    useEffect(() => {
        console.log(isbn);
        getBookDetails();
      }, []);

    async function getBookDetails(){
        let res=await fetch("/api/get-book"+"?isbn="+isbn)
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