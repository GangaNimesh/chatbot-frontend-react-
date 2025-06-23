import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from './HomePage';
import Chatbot from './Chatbot';
import '../assets/App.css';
function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;