import {Button,DialogContent,Grid,Typography,TextField} from '@mui/material';
import React,{Component} from "react";
import CreateBookPage from './createBook_box';
import Book from "./Book"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Redirect,
} from "react-router-dom";

function HomePage(props) {
    function renderHomePage() {
      return (
        <div>
          <h2>This is HomePage</h2>
          <Button variant='contained' to="/create" component={Link}>创建书籍</Button>
        </div>
      );
    }
  
    return (
      <Router>
        <Routes>
          <Route path="/" element={renderHomePage()} />
          <Route path="/create" element={<CreateBookPage/>} />
          <Route path="/book/:isbn" component={Book} />
        </Routes>
      </Router>
    );
  }
  
  export default HomePage;