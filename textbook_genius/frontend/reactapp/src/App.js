import logo from './logo.svg';
import './App.css'
// import Texbook from './components/create-book';
import Example from './components/example';
// import CreateBook_box from './components/createBook_box';
import HomePage from './components/HomePage';

import {Button,TextField} from '@mui/material';
import { useState,useEffect } from 'react';

function App(props) {

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
