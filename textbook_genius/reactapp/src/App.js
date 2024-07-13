import logo from './logo.svg';
import './App.css'
// import Texbook from './components/create-book';
import Example from './components/example';
// import CreateBook_box from './components/createBook_box';
import HomePage from './components/HomePage';
import UserPage from './components/UserPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Book from './components/Book';
import CreateBookPage from './components/CreateBookPage';
import SearchPage from './components/SearchPage';
import SearchResults from './components/SearchResults';
import UpdateBookPage from './components/UpdateBookPage';
import { getCookie } from './components/CSRFToken';

import {Button,TextField} from '@mui/material';
import { useState,useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
function App(props) {
  const[id,setId]=useState("");
  useEffect(()=>{
    const idd=getCookie('user_id');
    setId(idd);
  },[])

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage id={id}/>} />
          <Route path="/create" element={<CreateBookPage/>} />
          <Route path="/book/:isbn" element={<Book/>} />
          <Route path="/book/:isbn/update" element={<UpdateBookPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/user/:userId" element={<UserPage/>}/>
          <Route path="/search" element={<SearchPage/>}/>
          <Route path="/search/results" element={<SearchResults/>}/>
        </Routes>
      </Router>
      {/* <Texbook name="ilky"></Texbook>
      <Example></Example>
      <CreateBook_box></CreateBook_box> */}
    </div>
  );
}

export default App;
