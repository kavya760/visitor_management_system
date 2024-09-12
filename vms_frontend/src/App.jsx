import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'admin-lte/dist/css/adminlte.min.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'jquery'; 
import 'admin-lte/dist/js/adminlte.min'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Invitations from './pages/Invitations';
import DashBoard from './pages/DashBoard';
import LogBook from './pages/LogBook';
import VisitorPass from './pages/VisitorPass';
import SideNav from './components/SideNav';
import User from './pages/User';
import Login from './Login';
import LoginAlt from './LoginAlt'


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [firstName, setFirstName] = useState('');

  const handleLoginSuccess = (userInfo) => {
    setFirstName(userInfo.first_name);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    if (window.AdminLTE) {
      window.AdminLTE.init(); 
    }
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  return (
    <BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={
              <div style={{ backgroundColor: 'white', height: '100vh' }}>
                <Login onLoginSuccess={handleLoginSuccess} />
              </div>
            } />

            <Route path="/visitor/:visitId" element={<VisitorPass />} />
            {/* <Route path="/test" element={<LoginAlt />} /> */}
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/" element={<LoginAlt />} />
         

          </>
        ) : (
            <>
            <Route path="/" element={
              <div style={{ backgroundColor: 'white', height: '100vh' }}>
                <LoginAlt />
              </div>
            } />
              <Route path="*" element={
                <div className="wrapper">
                  <SideNav firstName={firstName} />
                  <div className="content-wrapper">
                    <Routes>
                      <Route path="/invitations" element={<Invitations />} />
                      <Route path="/dashboard" element={<DashBoard />} />
                      <Route path="/logbook" element={<LogBook />} />
                      <Route path="/user" element={<User />} />
                      <Route path="/visitor/:visitId" element={<VisitorPass />} />
                      {/* <Route path="/visitDetails" element={<VisitorPass />} /> */}
                      <Route path="/LoginAlt" element={<Navigate to="/invitations" />} />
                    </Routes>
                  </div>
                </div>
              } />
         
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}


export default App;
