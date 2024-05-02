import logo from './logo.svg';
import './App.css';
import Texbook from './components/textbook';
import Example from './components/example';

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
      <Texbook name="ilky"></Texbook>
      <Example></Example>
      {/* <title>you clicked {count} times</title>
      <h2>hi, {props.name}</h2>
      <Button onClick={()=>setCount(count+1)} variant="contained">ckick me</Button>
      <p>you ve clicked {count} times</p>
      <TextField label={"输入ISBN号"} onChange={(e)=>{setIsbn(e.target.value)}}></TextField>
      <Button variant="contained" color="secondary" onClick={handleSearchISBN}>搜索</Button>
      <p>{info}</p> */}
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
