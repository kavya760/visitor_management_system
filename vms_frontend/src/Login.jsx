import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import api from './api';
import background from './assets/vms_background.png';

export default function Login({ onLoginSuccess }) {
    const [showPassword, setShowPassword] = useState(false);
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const navigate = useNavigate();
    
    axios.defaults.withCredentials = true;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', values);
    
            if (response.data.status === "Success") {
                const { token, first_name, role_name } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('first_name', first_name);
                localStorage.setItem('role_name', role_name);
    
                toast.success("Login successful!");
    
                if (role_name === "admin") {
                    navigate('/dashboard');  
                } else if (role_name === "staff") {
                    navigate('/invitations');  
                } else {
                    navigate('/');  
                }
                onLoginSuccess({ first_name });
    
            } else {
                toast.error(response.data.message);  
            }
        } catch (error) {
            console.error("There was an error logging in!", error);
            toast.error("There was an error logging in!");
        }
    };


    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
              {/* Blurred Background Image */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'blur(8px)', 
                zIndex: 0
              }}></div>
  
              {/* Unblurred Login Form */}
              <div style={{
              position: 'relative',
              zIndex: 1,
              padding: '2rem',
              width: '100%',
              maxWidth: '500px',
              margin: 'auto',
              top: '50%',
              transform: 'translateY(-50%)'
            }}>

               <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <i className="fa-solid fa-lock" style={{ fontSize: '2rem', color: '#000', }}></i>
                    <h4>Sign In</h4>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email'>Email</label>
                        <input
                            type="email"
                            placeholder='Enter Email'
                            name='email'
                            autoComplete='off'
                            onChange={e => setValues({ ...values, email: e.target.value })}
                            className='form-control rounded-0'
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'>Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder='Enter Password'
                                name='password'
                                autoComplete='off'
                                onChange={e => setValues({ ...values, password: e.target.value })}
                                className='form-control rounded-0'
                            />
                            <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                            </span>
                        </div>
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'>Sign In</button>
                </form>
            </div>
        </div>
        
    );
}
