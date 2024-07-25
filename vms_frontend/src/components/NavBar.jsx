
import React from 'react';
import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

const NavBar = () => {
  return (
    <nav className="main-header navbar navbar-expand navbar-light navbar-white">
    <div className="container">
    <ul className="navbar-nav">
        <li className="nav-item">
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="#" className="nav-link">Home</a>
        </li>
        </ul>
        <ul className="navbar-nav ms-auto">
            <li className="nav-item">
            <i className="bi bi-box-arrow-right me-3 fs-4"></i>
            </li>
          </ul>
        </div>
        </nav>
    
  );
};

export default NavBar;
