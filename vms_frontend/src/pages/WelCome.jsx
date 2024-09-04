import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import SchedulevisitForm from '../components/SchedulevisitForm';
import background from  '../assets/vms_background.png';


function WelCome() {
  const navigate = useNavigate();
  const [borderColor, setBorderColor] = useState('white');
  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
            
     <button
        onClick={() => navigate('/login')}
        style={{
          position: 'absolute',  
          top: '20px',            
          right: '20px',          
          backgroundColor: 'transparent',
          fontSize: '1rem',
          cursor: 'pointer',
          textDecoration: 'none', 
          zIndex: 1,
        }}
      >
        SIGN IN
        <i className="bi bi-box-arrow-right" style={{ marginLeft: '10px', fontSize: '1.3rem' }}></i>
      </button>

      <h1 style={{
        fontFamily: 'Lato, sans-serif',
        fontSize: '3.7rem',
        color: '#003366',
        marginBottom: '10px',
        animation: 'fadeInUp 1s ease-out'
      }}>
        Welcome To VMS
      </h1>

    <h4 style={{
      fontFamily: 'Lato, sans-serif',
      fontSize: '1.1rem', 
      marginTop: '0px',
      marginBottom: '40px',
      textAlign: 'center',
      fontWeight: '100',
      fontStyle: 'italic',
      color: '#003366',
      animation: 'fadeInUp 1s ease-out'
    }}>
      Simplify Your Visitor Experience
    </h4>
      
      <button
        type="button"
        className="btn btn-success"
        data-bs-toggle="modal"
        data-bs-target="#scheduleMeetingModal"
        style={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'transparent',
          padding: '0.5rem 1rem',
          color: '#004d00',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: '300px',
          border: `2px solid ${borderColor}`, 
          transition: 'border-color 0.3s ease'
        }}
        onMouseEnter={() => setBorderColor('green')} 
        onMouseLeave={() => setBorderColor('white')}
      >
        SCHEDULE A MEETING
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
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <SchedulevisitForm />
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default WelCome;
