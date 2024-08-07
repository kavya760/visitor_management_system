import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
        </ul>
      </nav>
    </div>
  </aside>
);

// NavBar Component
const NavBar = () => {
  const location = useLocation();

  const getActiveBreadcrumb = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/dashboard':
        return 'Dashboard';
      case '/logbook':
        return 'LogBook';
      case '/invitations':
        return 'Invitations';
      default:
        return 'Home';
    }
  };

  return (
    <>
     <nav className="main-header navbar navbar-expand navbar-light navbar-white">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <ul className="navbar-nav d-flex align-items-center">
          <li className="nav-item">
            <a className="nav-link sidebar-toggle-btn" data-widget="pushmenu" data-auto-collapse-size="768" href="#" role="button">
              <i className="bi bi-list" style={{ fontSize: '1.3rem', color: 'black' }}></i>
            </a>
          </li>
        </ul>
        <ol className="breadcrumb float-sm-left m-0">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">
            {getActiveBreadcrumb()}
          </li>
        </ol>
        <ul className="navbar-nav d-flex align-items-center ms-auto">
          <li className="nav-item">
            <i className="bi bi-box-arrow-right me-3 fs-4"></i>
          </li>
        </ul>
      </div>
    </nav>
   
  </>
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
