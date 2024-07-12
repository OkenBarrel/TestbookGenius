import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';
// import './UserPage.css';
import { Container, TextField, Typography, Button, Paper, Grid, Box, Avatar } from '@mui/material';
import FileUpload from "./FileUpload";
const UserPage =()=> {
    //TODO: Dummy data, in real situation, please using API to acquire user data.

    // const { userId } = useParams();
    const userId = 'ls53';
    const [userInfo, setUserInfo] = useState(
        {
            userID: 'ls53',
            name: 'Shit',
            department: 'LAS',
            major: 'Computer Science',
            ProgramStartYear: '2024',
            credit: '100',
            avatarUrl: '/Avatar/DefaultAvatar.png'
        });

    const [isEditing, setIsEditing] = useState(false);
    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         try {
    //             const requestConfg = {
    //                 method:"GET",
    //                 headers: {
    //                     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //                 }
    //             };
    //             const response = await fetch(`http://127.0.0.1:8000/api/user/${userId}/`, requestConfg)
    //
    //             setUserInfo(response.data);
    //         } catch (error) {
    //             console.error('Error fetching user data:', error);
    //         }
    //     };
    //     fetchUserData();
    // }, [userId]);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/user/${userId}/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                } else {
                    console.error('Error fetching user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [userId]);


    const handleFileSelect = (fileUrl) => {
        setUserInfo({
            ...userInfo,
            avatarUrl: fileUrl
        });
    };

    const handleInputChange =(e)=> {
        const {name, value} = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value
        });
    };
    const clickEditHandler = ()=>{
        setIsEditing(!isEditing);
    };
    const clickSubmitHandler= async (e)=>{
        e.preventDefault();
        setIsEditing(false);
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/user/${userId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfo)
            });
            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
                setIsEditing(false);
            } else {
                console.error('Error updating user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    }



    return (
        <Container maxWidth="sm" style={{ marginTop: '20px' }}>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Box display="flex" justifyContent="center" mb={2}>
                    <Avatar alt="User Avatar" src={userInfo.avatarUrl} sx={{ width: 80, height: 80 }} />
                </Box>
                {isEditing && (
                    <Box display="flex" justifyContent="center" mb={2}>
                        <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes="image/*" label="Change Avatar" />
                    </Box>
                )}
                <Typography variant="h4" component="h1" gutterBottom>
                    {userInfo.name}'s Profile
                </Typography>
                <Box mb={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                <strong>User ID:</strong> {userInfo.userID}
                            </Typography>
                        </Grid>
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
                                name="name"
                                value={userInfo.name}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Department"
                                name="department"
                                value={userInfo.department}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                disabled={!isEditing}
                            />
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
                                name="programStartYear"
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
    );
};

export default UserPage;
// ReactDOM.render(<UserProfile />, document.getElementById('root'));
