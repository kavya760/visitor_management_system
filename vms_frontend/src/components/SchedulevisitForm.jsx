import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function SchedulevisitForm() {
  const [locations, setLocations] = useState([]);
  const [visittypes, setVisittypes] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date: '',
    location_id: '',
    purpose_of_visit: '',
    user_id: '',
    visit_type_id: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsRes, visitTypesRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/locations'),
          axios.get('http://localhost:5000/api/visittypes'),
          axios.get('http://localhost:5000/api/users'),
        ]);
        setLocations(locationsRes.data);
        setVisittypes(visitTypesRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      console.log("Form Data being sent:", formData);
      await axios.post('http://localhost:5000/api/users/create', formData);
      alert('User created successfully');
      resetForm();
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/update/${selectedUserId}`, formData);
      alert('User updated successfully');
      resetForm();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user');
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      date: '',
      location_id: '',
      purpose_of_visit: '',
      user_id: '',
      visit_type_id: ''
    });
    setEditMode(false);
    setSelectedUserId(null);
  };

  const handleEdit = async (user_id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${user_id}`);
      setFormData(response.data);
      setSelectedUserId(user_id);
      setEditMode(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (user_id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/delete/${user_id}`);
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container mt-2">
      <h3 className="text-center" style={{ textDecoration: 'underline' }}>Schedule Visit</h3>
      <form className="row g-3 mt-3" onSubmit={editMode ? handleUpdate : handleCreate}>
        <div className="col-md-6">
          <input type="text" className="form-control" id="first_name" placeholder="First Name*" value={formData.first_name} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" id="last_name" placeholder="Last Name*" value={formData.last_name} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <input type="email" className="form-control" id="email" placeholder="Email Address*" value={formData.email} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" id="phone_number" placeholder="Phone Number*" value={formData.phone_number} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <input type="datetime-local" className="form-control" id="date" value={formData.date} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <select className="form-select" id="location_id" value={formData.location_id} onChange={handleChange}>
            <option value="" disabled>Location</option>
            {locations.map((location) => (
              <option key={location.location_id} value={location.location_id}>{location.location_name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" id="purpose_of_visit" placeholder="Purpose of Visit*" value={formData.purpose_of_visit} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <select className="form-select" id="user_id" value={formData.user_id} onChange={handleChange}>
            <option value="" disabled>Host</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <select className="form-select" id="visit_type_id" value={formData.visit_type_id} onChange={handleChange}>
            <option value="" disabled>Visit Type</option>
            {visittypes.map((visittype) => (
              <option key={visittype.visit_type_id} value={visittype.visit_type_id}>{visittype.visit_type}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          {editMode ? 'Update' : 'Schedule'}
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default SchedulevisitForm;
