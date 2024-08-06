import React from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';

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
    <a href="/" className="brand-link">
      <span className="brand-text font-weight-light">Admin</span>
    </a>
    <div className="sidebar">
      <nav className="mt-2">
        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <SidebarLink to="/" icon="fa-home" label="Welcome" />
          <SidebarLink to="/dashboard" icon="fa-tachometer-alt" label="Dashboard" />
          <SidebarLink to="/logbook" icon="fa-book" label="LogBook" />
          <SidebarLink to="/invitations" icon="fa-envelope" label="Invitations" />
          <SidebarLink to="/user" icon="fa-envelope" label="User" />
        </ul>
      </nav>
    </div>
  </aside>
);

// NavBar Component
const NavBar = () => {

  return (
    <nav className="main-header navbar navbar-expand navbar-light navbar-white">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" data-auto-collapse-size="768" href="#" role="button">
              <i className="bi bi-list" style={{ fontSize: '1.3rem', color: 'black' }}></i>
            </a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/" className="nav-link">Home</Link>
          </li>
        </ul>
        <ul className="navbar-nav ms-auto d-flex align-items-center">
          <li className="nav-item">
            <i className="bi bi-box-arrow-right me-3 fs-4"></i>
          </li>
        </ul> 
    </nav>
  );
};

// SideNav Component
const SideNav = () => (
  <div>
    <NavBar />
    <Sidebar />
  </div>
);

export default SideNav;
