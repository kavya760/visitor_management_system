import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgGridUsers from '../components/AgGridUsers';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function User() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        role_id: ''
    });
    const [createFormData, setCreateFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone_number: '',
        role_id: ''
    });
    const [updateError, setUpdateError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/getusers');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/roles'); 
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };
        
        fetchUsers();
        fetchRoles();
    }, []);

    const validateForm = (data, isCreateForm = false) => {
        const { first_name, last_name, email, phone_number, role_id, password } = data;
        const errors = {};

        if (!first_name) errors.first_name = 'First name is required.';
        if (!last_name) errors.last_name = 'Last name is required.';
        if (!email) errors.email = 'Email is required.';
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) errors.email = 'Invalid email format.';
        }
        if (!phone_number) errors.phone_number = 'Phone number is required.';
        else {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone_number)) errors.phone_number = 'Phone number must be 10 digits.';
        }
        if (!role_id) errors.role_id = 'Role is required.';
        if (isCreateForm && (!password || password.length < 6)) errors.password = 'Password must be at least 6 characters.';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm(createFormData, true)) return;
        console.log('Form Data:', createFormData);
        try {
            const response = await axios.post('http://localhost:5000/api/users/create', createFormData);
            console.log('Response:', response.data);
            setUsers([...users, response.data]); 
            toast.success('User created successfully!');
            const createModal = window.bootstrap.Modal.getInstance(document.getElementById('createModal'));
            createModal.hide();
            setCreateFormData({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                phone_number: '',
                role_id: ''
            });
            setValidationErrors({});
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error('Error creating user!');
        }
    };

    const handleUpdate = (user) => {
        setSelectedUser(user);
        setFormData({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            phone_number: user.phone_number || '',
            role_id: user.role_id || ''
        });
        const modal = new window.bootstrap.Modal(document.getElementById('updateModal'));
        modal.show();
    };

    const handleDelete = async (user) => {
        console.log('Delete user:', user);
        try {
            await axios.delete(`http://localhost:5000/api/users/delete/${user.user_id}`);
            setUsers(users.filter(u => u.user_id !== user.user_id));
            toast.success("Delete successful!");
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user. Please try again.');
            setError('Failed to delete user');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleCreateChange = (e) => {
        setCreateFormData({ ...createFormData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm(formData)) return;
        try {
            await axios.put(`http://localhost:5000/api/users/update/${selectedUser.user_id}`, formData);
            const updatedUsers = users.map(user =>
                user.user_id === selectedUser.user_id ? { ...user, ...formData } : user
            );
            setUsers(updatedUsers);
            toast.success('User updated successfully!');
            const modal = window.bootstrap.Modal.getInstance(document.getElementById('updateModal'));
            modal.hide();
            setValidationErrors({});
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Error updating user!');
            setUpdateError('Error updating user!');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-3">
        <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
        <h4 className="mb-0">User</h4>
        <ol className="breadcrumb m-0 ms-3">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">
            User
            </li>
            </ol>
        </div>
            <div className="text-end">
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal"
                style={{ padding: '4px 8px', fontSize: '15px' }}>
                    Create User +
                </button>
                </div>
                </div><br/>
            {error && <div className="alert alert-danger">{error}</div>}
            <AgGridUsers rowData={users} onUpdate={handleUpdate} onDelete={handleDelete} />

            {/* create modal */}
            <div className="modal fade" id="createModal" tabIndex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Create User</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <form className="row g-3 mt-3" onSubmit={handleCreateSubmit}>
                                <div className="col-md-6">
                                    <label htmlFor="first_name">First Name<span style={{ color: 'red' }}> *</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="first_name"
                                        value={createFormData.first_name}
                                        onChange={handleCreateChange}
                                        required
                                    />
                                    {validationErrors.first_name && <div className="text-danger">{validationErrors.first_name}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="last_name">Last Name<span style={{ color: 'red' }}> *</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last_name"
                                        value={createFormData.last_name}
                                        onChange={handleCreateChange}
                                        required
                                    />
                                    {validationErrors.last_name && <div className="text-danger">{validationErrors.last_name}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="email">Email Address<span style={{ color: 'red' }}> *</span></label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={createFormData.email}
                                        onChange={handleCreateChange}
                                        required
                                    />
                                    {validationErrors.email && <div className="text-danger">{validationErrors.email}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="password">Password<span style={{ color: 'red' }}> *</span></label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={createFormData.password}
                                        onChange={handleCreateChange}
                                        required
                                    />
                                    {validationErrors.password && <div className="text-danger">{validationErrors.password}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="phone_number">Phone Number<span style={{ color: 'red' }}> *</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phone_number"
                                        value={createFormData.phone_number}
                                        onChange={handleCreateChange}
                                        required
                                    />
                                    {validationErrors.phone_number && <div className="text-danger">{validationErrors.phone_number}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="role_id">Role<span style={{ color: 'red' }}> *</span></label>
                                    <select
                                        className="form-select"
                                        id="role_id"
                                        value={createFormData.role_id}
                                        onChange={handleCreateChange}
                                        required
                                    >
                                        <option value="" disabled>Choose role</option>
                                        {roles.map(role => (
                                            <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                                        ))}
                                    </select>
                                    {validationErrors.role_id && <div className="text-danger">{validationErrors.role_id}</div>}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Modal */}
            <div className="modal fade" id="updateModal" tabIndex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Update User</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <form className="row g-3 mt-3" onSubmit={handleSubmit}>
                                <div className="col-md-6">
                                    <label htmlFor="first_name">First Name<span style={{ color: 'red' }}> *</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                    />
                                    {validationErrors.first_name && <div className="text-danger">{validationErrors.first_name}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="last_name">Last Name<span style={{ color: 'red' }}> *</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                    />
                                    {validationErrors.last_name && <div className="text-danger">{validationErrors.last_name}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="email">Email Address<span style={{ color: 'red' }}> *</span></label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    {validationErrors.email && <div className="text-danger">{validationErrors.email}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="phone_number">Phone Number<span style={{ color: 'red' }}> *</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        required
                                    />
                                    {validationErrors.phone_number && <div className="text-danger">{validationErrors.phone_number}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="role_id">Role<span style={{ color: 'red' }}> *</span></label>
                                    <select
                                        className="form-select"
                                        id="role_id"
                                        value={formData.role_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Choose role</option>
                                        {roles.map(role => (
                                            <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                                        ))}
                                    </select>
                                    {validationErrors.role_id && <div className="text-danger">{validationErrors.role_id}</div>}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;
