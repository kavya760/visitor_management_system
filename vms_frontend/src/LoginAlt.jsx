import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, LogIn } from 'lucide-react';
import SchedulevisitForm from './components/SchedulevisitForm';

export default function LoginAlt() {
  return (
    <div className="min-vh-100 d-flex flex-column bg-white text-dark">
      <header className="bg-light shadow-sm py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="fs-2 fw-bold text-dark">
            Visit<span className="text-primary">Flow</span>
          </h1>
          <Link to="/signin" className="btn btn-outline-primary d-flex align-items-center">
            <LogIn className="me-2" />
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="container text-center">
          <h2 className="fs-1 fw-bold mb-4 text-dark">
            Welcome to Visit<span className="text-primary">Flow</span>
          </h2>
          <p className="fs-4 text-secondary mx-auto mb-5" style={{ maxWidth: '600px' }}>
            Streamline your visitor management process with our intuitive and efficient system.
          </p>

          <button
            type="button"
            className="btn btn-primary btn-sm rounded-pill px-3 py-2"
            style={{ maxWidth: 'fit-content', fontSize: '0.875rem' }}
            data-bs-toggle="modal"
            data-bs-target="#scheduleMeetingModal"
          >
            <CalendarPlus className="me-1" />
            Schedule
          </button>

          <div
            className="modal fade"
            id="scheduleMeetingModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="scheduleMeetingModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="d-flex justify-content-end p-2">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <SchedulevisitForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-light py-4 text-center text-secondary">
        <div className="container">
          <p className="mb-3">&copy; {new Date().getFullYear()} VisitFlow. All rights reserved.</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/privacy" className="text-secondary">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-secondary">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
