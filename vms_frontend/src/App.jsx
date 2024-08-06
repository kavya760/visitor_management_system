import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import 'admin-lte/dist/css/adminlte.min.css'; 
import 'jquery'; 
import 'admin-lte/dist/js/adminlte.min'; 

import WelCome from './pages/WelCome';
import Invitations from './pages/Invitations';
import DashBoard from './pages/DashBoard';
import LogBook from './pages/LogBook';
import SideNav from './components/SideNav';
import User from './pages/User';



function App() {

  useEffect(() => {
    if (window.AdminLTE) {
      window.AdminLTE.init(); 
    }
  }, []);
  return (
    <BrowserRouter>
      <div className="wrapper">
     
        <SideNav />
    
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<WelCome />} />
            <Route path="/invitations" element={<Invitations />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/logbook" element={<LogBook />} />
            <Route path="/user" element={<User />} />
          </Routes>
        </div>
      </div>
     
    </BrowserRouter>
  );
}

export default App;
