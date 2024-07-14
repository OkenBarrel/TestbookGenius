import {Button,DialogContent,Grid,Typography,TextField,Box} from '@mui/material';
import React,{Component, useEffect, useState} from "react";
import SearchHome from './SearchHome';
import NavigateButton from './Navigate';
import HelloComponent from './HelloComponent';
import { getCookie,getCsrfToken } from './CSRFToken';
import {Avatar}  from '@mui/material';
import {
    HashRouter as Router,
    Link,
} from "react-router-dom";
import UserPage from "./UserPage";
import { AlignHorizontalRight } from '@mui/icons-material';
import { useReducer } from 'react'

function HomePage() {
  const [out,setOut]=useState(false);
  const[user_id,setId]=useState(null);
  const[user_name,setName]=useState(null);
  const[avatar_url,setUrl]=useState(null);

  async function handleLogout(){
    const csrftoken=getCsrfToken();
  
    const requestOption={
  
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
      },
      credentials: 'include',
    }
  
    let response=await fetch("http://192.168.225.149:80/api/logout",requestOption);
    if(!response.ok){
      console.log("log out failed");
      return;
    }
    setName(getCookie('username'));
    setId(getCookie('user_id'));
    setUrl(null);
  
  }
  

  useEffect(()=>{
    getLog();
    setName(getCookie('username'));
    setId(getCookie('user_id'));

  },[]);

  const getLog=async ()=>{
    let response=await fetch("http://192.168.225.149:80/api/is-loggedin",{
      credentials:'include'
    });
    let data=await response.json()
    setUrl(data.avatar_url)

  }
  
    function renderHomePage() {
      return (
        <div paddling="10%">
          <Grid container spacing={2} direction={'column'} >
            <Grid item>
              <Grid container spacing={2} direction="row" justifyContent={'center'}>
                <Grid item margin={1.5} xs={7} sm={7} md={7} lg={7} xl={7}>
                  <Box display="flex" flexDirection="row" justifyContent="flex-start">
                    <Button variant='contained' to="/create" component={Link}>创建书籍</Button>
                    {!getCookie('user_id')&&(<Button variant='contained' to="/login" component={Link}>登录</Button>)}
                    <Button variant='contained' to={`/user/${getCookie('user_id')}`} component={Link}>用户信息</Button>
                    <Button variant='contained'
                      onClick={handleLogout}>
                      退出登录
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3} container justifyContent="flex-end">
                  <Box
                    justifyContent="flex-end"
                    border="0px solid"
                    display="flex"
                    alignItems="center"
                    textAlign="right"
                    width="100%"
                    marginRight="5%"
                  >
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center">
                      <Grid item>
                        {console.log("name"+user_name)}
                        <Link to={`/user/${user_id}`} >
                          <Avatar src={avatar_url} sx={{ width: 55, height: 55 }}></Avatar>
                        </Link>
                      </Grid>
                      <Grid item marginLeft="5%">
                        <HelloComponent user_name={user_name} id={user_id}/>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Box
                border="1"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="40vh"
                width="100%"
                sx={{textAligh:'right'}}
              >
                  <Box width="80%" alignItems="left">
                      <NavigateButton />
                  </Box>
                  <Box width="80%">
                      <SearchHome />
                  </Box>
              </Box>
            </Grid>
          </Grid>
        </div>
      );
    }
  
    return (
      renderHomePage()
    );
  }
  
  export default HomePage;


