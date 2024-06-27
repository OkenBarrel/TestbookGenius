import logo from './logo.svg';
import './App.css';
import Texbook from './components/create-book';
import Example from './components/example';
import CreateBook_box from './components/createBook_box';
import HomePage from './components/HomePage';

import {Button,TextField} from '@mui/material';
import { useState,useEffect } from 'react';

function App(props) {

  // const [count,setCount]=useState(0);
  // const[isbn,setIsbn]=useState(0);
  // const[info,setInfo]=useState("");
  // useEffect(() => {
  //   document.title = `You clicked ${count} times`;
  // });
  // async function handleSearchISBN(){
  //   let response= await fetch("/api/get-book"+"?isbn="+isbn)
  //   console.log(await response.json().then((data)=>{console.log(data.title)}))
  // }
  return (
    <div className="App">
      <HomePage/>
      {/* <Texbook name="ilky"></Texbook>
      <Example></Example>
      <CreateBook_box></CreateBook_box> */}
    </div>
  );
}

export default App;
