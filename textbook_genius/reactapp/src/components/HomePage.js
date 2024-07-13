import {Button,DialogContent,Grid,Typography,TextField} from '@mui/material';
import React,{Component, useState} from "react";
import CreateBookPage from './CreateBookPage';
import Book from "./Book";
import UpdateBookPage from './UpdateBookPage';
import LoginPage from './LoginPage';
import RegisterPage from "./RegisterPage";
import SearchPage from './SearchPage';
import SearchResults from './SearchResults';
import HelloComponent from './HelloComponent';
import { getCookie } from './CSRFToken';
import {
    HashRouter as Router,
    Routes,
    Route,
    Link,
    Redirect,
} from "react-router-dom";
import UserPage from "./UserPage";

async function handleLogout(){

  let response=await fetch("api/loggout");
  if(!response.ok){
    console.log("log out failed");
    return;
  }
  console.log("log out success");

}

function HomePage(props) {
  
    function renderHomePage() {
      return (
        <div>
          <Grid>
            <Grid item xs={12} justifyContent="flex-end">
              <HelloComponent/>
            </Grid>
          </Grid>
          <h2>This is HomePage</h2>
          <h2></h2>
          <Button variant='contained' to="/create" component={Link}>创建书籍</Button>
          {/*<Button variant='contained' to="/update" component={Link}>修改书籍信息</Button>*/}
          <Button variant='contained' to="/register" component={Link}>注册</Button>
          <Button variant='contained' to="/login" component={Link}>登录</Button>
          <Button variant='contained' to={`/user/${getCookie('user_id')}`} component={Link}>用户信息</Button>
          <Button variant='contained' to="/search" component={Link}>搜索</Button>
          <Button variant='contained' onClick={handleLogout}>退出登录</Button>
        </div>
      );
    }
  
    return (
      <div>
          <Grid>
            <Grid item xs={12} justifyContent="flex-end">
              <HelloComponent/>
            </Grid>
          </Grid>
          <h2>This is HomePage</h2>
          <h2></h2>
          <Button variant='contained' to="/create" component={Link}>创建书籍</Button>
          {/*<Button variant='contained' to="/update" component={Link}>修改书籍信息</Button>*/}
          <Button variant='contained' to="/register" component={Link}>注册</Button>
          <Button variant='contained' to="/login" component={Link}>登录</Button>
          <Button variant='contained' to={`/user/${getCookie('user_id')}`} component={Link}>用户信息</Button>
          <Button variant='contained' to="/search" component={Link}>搜索</Button>
          <Button variant='contained' onClick={handleLogout}>退出登录</Button>
        </div>
      // <Router>
      //   <Routes>
      //     <Route path="/" element={renderHomePage()} />
      //     <Route path="/create" element={<CreateBookPage/>} />
      //     <Route path="/book/:isbn" element={<Book/>} />
      //     <Route path="/book/:isbn/update" element={<UpdateBookPage/>} />
      //     <Route path="/register" element={<RegisterPage/>} />
      //     <Route path="/login" element={<LoginPage/>}/>
      //     <Route path="/user/:userId" element={<UserPage/>}/>
      //     <Route path="/search" element={<SearchPage/>}/>
      //     <Route path="/search/results" element={<SearchResults/>}/>
      //   </Routes>
      // </Router>

    );
  }
  
  export default HomePage;


