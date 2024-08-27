import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import api from './api';

export default function Login() {
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
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('first_name', response.data.first_name);
                toast.success("Login successful!");
                navigate('/invitations');
                window.location.reload();
            } else {
                toast.error(response.data.message);  
            }
        } catch (error) {
            console.error("There was an error logging in!", error);
            toast.error("There was an error logging in!");
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center'>
            <div className='p-3 rounded w-50' >
                <h4 className='text-center'>Sign In</h4>
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
