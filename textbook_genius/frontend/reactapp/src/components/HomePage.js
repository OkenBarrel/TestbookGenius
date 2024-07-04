import {Button,DialogContent,Grid,Typography,TextField} from '@mui/material';
import React,{Component} from "react";
import CreateBookPage from './CreateBookPage';
import Book from "./Book"
import LoginPage from './LoginPage';
import RegisterPage from "./RegisterPage"
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
          <Button variant='contained' to="/register" component={Link}>注册</Button>
          <Button variant='contained' to="/login" component={Link}>登录</Button>
          <Button variant='contained' to="/user/:userId" component={Link}>用户信息</Button>
        </div>
      );
    }
  
    return (
      <Router>
        <Routes>
          <Route path="/" element={renderHomePage()} />
          <Route path="/create" element={<CreateBookPage/>} />
          <Route path="/book/:isbn" element={<Book/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/user/:userId"/>
          {/* <Route path=/> */}
        </Routes>
      </Router>
    );
  }
  
  export default HomePage;