import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams,useNavigate } from 'react-router-dom';
import { getCookie } from './CSRFToken';
import Home from './Navigate';
import HelloComponent from './HelloComponent';

// import './UserPage.css';
import { Container, TextField, Typography, Button, Paper, Grid, Box, Avatar, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// import FileUpload from "./FileUpload";
import InputFileUpload from './FileUpload';
const UserPage =()=> {
    //TODO: Dummy data, in real situation, please using API to acquire user data.

    const { userId } = useParams();
    const csrftoken = getCookie('csrftoken');
    const[url,setUrl]=useState("");
    const [originalUserInfo, setOriginalUserInfo] = useState(null);
    const navigate=useNavigate();
    // const userId = 'testuser';
    const [userInfo, setUserInfo] = useState(
        {
            username: '',
            user_id:'',
            department: '',
            major: '',
            ProgramStartYear: '',
            credit: '',
            avatarFile: null,
        });
    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        if(getCookie('username')==null){
            navigate('/login',{replace:true,state:{from:'createBook'}})
        }
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
            try {
    
                console.log(userId)
                const response = await fetch("http://8.130.18.80:80/api/user"+"?user_id="+userId);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data.avatar_url)
                    setUserInfo({
                        username: data.username,
                        user_id:userId,
                        department: data.user_department,
                        major: data.user_major,
                        ProgramStartYear: '2024',
                        credit: data.user_credit,
                        avatarFile: ''
                    });
                    setUrl(data.avatar_url)
                } else {
                    console.error('Error fetching user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

    // const handleFileSelect = (fileUrl) => {
    //     setUserInfo({
    //         ...userInfo,
    //         avatarUrl: fileUrl
    //     });
    // };
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // 这里是文件的 base64 URL
                const fileUrl = e.target.result;
                
                // 更新用户信息，包括文件对象和 URL
                setUserInfo({
                    ...userInfo,
                    // avatarUrl: fileUrl, // 将 URL 存储在 avatarUrl 中
                    avatarFile: file    // 也存储文件对象
                });
                setUrl(fileUrl);
            };
    
            // 读取文件作为 Data URL
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange =(e)=> {
        const {name, value} = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value
        });
    };
    const clickEditHandler = ()=>{
        if (isEditing) {

            setUserInfo(originalUserInfo);
            setUrl(originalUserInfo.avatarUrl);
        } else {

            setOriginalUserInfo({ ...userInfo, avatarUrl: url });
        }
        setIsEditing(!isEditing);
    };
    const clickSubmitHandler= async (e)=>{
        e.preventDefault();
        setIsEditing(false);
        try{
            const formData = new FormData();
            formData.append('user_id',userInfo.user_id)
            formData.append('user_major', userInfo.major);
            formData.append('user_department', userInfo.department);
            formData.append('user_credit', userInfo.credit);
            if (userInfo.avatarFile) {
                formData.append('user_avatar', userInfo.avatarFile);
            }
            console.log(userInfo.avatarFile)
            const response = await fetch("http://8.130.18.80:80/api/user"+"?user_id="+userId, {
                    method: 'PUT',
                    headers:{
                        // "Content-Type": "multipart/form-data",
                        "X-CSRFToken": csrftoken
                    },
                    body:formData
                }
            );
            if (response.ok) {
                const data = await response.json();
                setUserInfo({
                    username: data.user,
                    department: data.user_department,
                    major: data.user_major,
                    ProgramStartYear: data.user_indate,
                    credit: data.user_credit,
                    avatarFile: data.avatarFile
                });
                setUrl(data.avatar_url)
                fetchUserData()
                setIsEditing(false);
            } else {
                console.error('Error updating user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    }

    return (
        <Grid container justifyContent="center" spacing="50px" style={{ minHeight: '100%' }}>
            <Grid item width = "100%">
                <Box border = "px dotted #acf" width = "100%">
                    <Grid container spacing={0} sx={{display:'flex', flexDirection:'row'}} style={{ marginTop: '5px', marginLeft: '5%' }}>
                        <Grid item xs={7} sm={7} md={7} align="left" style={{ marginTop: '16px'}}>
                            <Home />
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} align="right">
                            <HelloComponent user_name={getCookie('username')} id={getCookie('user_id')}/>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item width="100%">
                <Container maxWidth="sm" style={{ marginTop: '20px' }}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Box display="flex" justifyContent="center" mb={2}>
                            <Avatar alt="User Avatar" src={url} sx={{ width: 80, height: 80 }} />
                        </Box>
                        {isEditing && (
                            <Box display="flex" justifyContent="center" mb={2}>
                                <InputFileUpload onChange={handleFileSelect}></InputFileUpload>
                                {/* <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes="image/*" label="Change Avatar" /> */}
                            </Box>
                        )}
                        <Typography variant="h4" component="h1" gutterBottom>
                            {userInfo.username}'s Profile
                        </Typography>
                        <Box mb={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body1">
                                        <strong>Credit:</strong> {userInfo.credit}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <form onSubmit={clickSubmitHandler}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Name"
                                        name="username"
                                        value={userInfo.username}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" disabled={!isEditing}>
                                        <InputLabel id="department-label">Department</InputLabel>
                                        <Select
                                            labelId="department-label"
                                            name="department"
                                            value={userInfo.department}
                                            onChange={handleInputChange}
                                            label="Department"
                                        >
                                            <MenuItem value="理学部">理学部</MenuItem>
                                            <MenuItem value="信息学部">信息学部</MenuItem>
                                            <MenuItem value="文法学部">文法学部</MenuItem>
                                            <MenuItem value="经管学部">经管学部</MenuItem>
                                            <MenuItem value="环生学部">环生学部</MenuItem>
                                            <MenuItem value="城建学部">城建学部</MenuItem>
                                            <MenuItem value="材制学部">材制学部</MenuItem>
                                            <MenuItem value="艺设学院">艺设学院</MenuItem>
                                            <MenuItem value="马克思学院">马克思学院</MenuItem>
                                            <MenuItem value="素质教育学院">素质教育学院</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Major"
                                        name="major"
                                        value={userInfo.major}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Program Start Year"
                                        name="ProgramStartYear"
                                        value={userInfo.ProgramStartYear}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ textAlign: 'right' }}>
                                    <Button
                                        variant="contained"
                                        color={isEditing ? 'secondary' : 'primary'}
                                        onClick={clickEditHandler}
                                        style={{ marginRight: '10px' }}
                                    >
                                        {isEditing ? 'Cancel' : 'Edit'}
                                    </Button>
                                    {isEditing && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                        >
                                            Save
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Container>
            </Grid>
        </Grid>
    );
};

export default UserPage;
// ReactDOM.render(<UserProfile />, document.getElementById('root'));
