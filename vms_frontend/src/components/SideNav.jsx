import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from  '../assets/reception.png';

// SidebarLink Component
const SidebarLink = ({ to, icon, label }) => (
  <li className="nav-item">
    <Link to={to} className="nav-link">
      <i className={`nav-icon fas ${icon}`}></i>
      <p>{label}</p>
    </Link>
  </li>
);

// Sidebar Component
const Sidebar = () => (
  <aside className="main-sidebar sidebar-dark-primary elevation-4">
     
  <a href='#' className="brand-link">

  <img
    src={logo}
    alt="AdminLTE Logo"
    className='brand-image img-circle elevation-6'
    height="80" width="80"
   
  />
  <span className='brand-text font-weight-light'> VISITOR FLOW</span>
    
  </a>
  

  
  {/* <span
    className="brand-text font-weight-light"
    style={{
      marginLeft: '10px', 
      fontWeight: '400', 
      fontSize: '25px',
    }}
  ><strong><i>
    VISITOR FLOW
    </i></strong></span> */}


<br/><br/>
    <div className="sidebar">
      <nav className="mt-2">
      <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <SidebarLink to="/dashboard" icon="fa-tachometer-alt" label="Dashboard" />
          <SidebarLink to="/logbook" icon="fa-book" label="LogBook" />
          <SidebarLink to="/invitations" icon="fa-envelope" label="Invitations" />
          <SidebarLink to="/user" icon="fa-solid fa-user" label="User" />
        </ul>
      </nav>
    </div>
  </aside>
);

// NavBar Component
const NavBar = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate(); 

  useEffect(() => {
    const firstName = localStorage.getItem('first_name');
    if (firstName) {
        setUser({ first_name: firstName });
    }

    const initializeTooltips = async () => {
      if (window.bootstrap) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map((tooltipTriggerEl) => {
          return new window.bootstrap.Tooltip(tooltipTriggerEl);
        });
      } else {

        console.error("Bootstrap JavaScript not loaded.");
      }
    };
    initializeTooltips();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('first_name');
    navigate('/'); 
    setUser({});
    window.location.reload();
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-cyan" >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <ul className="navbar-nav d-flex align-items-center">
          <li className="nav-item">
            <a
              className="nav-link sidebar-toggle-btn"
              data-widget="pushmenu"
              data-auto-collapse-size="768"
              href="#"
              role="button"
            >
              <i className="bi bi-list" style={{ fontSize: '1.3rem', color: 'black' }}></i>
            </a>
          </li>
        </ul>
        <div className="d-flex align-items-center ms-auto" style={{ fontSize: '1.2rem', marginLeft: '-10px' }}>
          {user.first_name ? (
            <span className="navbar-text me-3 ms-10 text-light">Hi, {user.first_name}</span>
          ) : null}
          <button
            onClick={handleLogout}
            className="btn btn-link"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Logout"
          >
            <i className="fa-sharp fa-solid fa-arrow-right-from-bracket fs-4" style={{ fontSize: '1.3rem', color: 'black' }}></i>
          </button>
        </div>
        </div>
    </nav>
  );
};


// SideNav Component
const SideNav = ({ firstName }) => (
  <div>
    <NavBar firstName={firstName} />
    <Sidebar />
  </div>
);

export default SideNav;
