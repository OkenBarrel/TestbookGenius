import React, { Component, useState,useEffect } from "react";
import {Button,DialogContent,TextField} from '@mui/material';
import { useParams, useHistory } from 'react-router-dom';
import CreateBookPage from "./createBook_box";

function Book(props){
    const { isbn } = useParams();
    const [title,setTitle]=useState("");
    useEffect(() => {
        getBookDetails();
      }, []);
    const getBookDetails=()=>{
        fetch("/api/get-book"+"?isbn="+isbn)
        .then((response)=>{
            return response.json();
        })
        .then((data)=>{
            setTitle(data.title)
        })
    }

    return(
        <div>
            <h2>This is Book {title}</h2>
        </div>
    );

}
export default Book;