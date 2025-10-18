import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import SignIn from './components/SignIn.jsx';
import Home from './components/home.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home user={{ name: 'Admin', isAdmin: true }} />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
