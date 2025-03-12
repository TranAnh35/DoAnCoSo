// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Signin from './pages/Signin';
import ImageProcess from './pages/ImageProcess';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/process" element={<ImageProcess />} />
        <Route path="/" element={<Signin />} />
      </Routes>
    </Router>
  );
};

export default App;