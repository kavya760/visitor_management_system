
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <a href="/" className="brand-link">
        <span className="brand-text font-weight-light">Admin</span>
      </a>
      <div className="sidebar">
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <i className="nav-icon fas fa-home"></i>
                <p>Welcome</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/logbook" className="nav-link">
                <i className="nav-icon fas fa-book"></i>
                <p>LogBook</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/invitations" className="nav-link">
                <i className="nav-icon fas fa-envelope"></i>
                <p>Invitations</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
