import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom'; 
function SchedulevisitForm({onChange}) {
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
    purpose: '',
    host_id: '',
    visit_type_id: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);


    const fetchData = async () => {
      try {
        const locationsRes = await axios.get('http://localhost:5000/api/locations');
        const visitTypesRes = await axios.get('http://localhost:5000/api/visittypes');
        const usersRes = await axios.get('http://localhost:5000/api/getusers');
        setLocations(locationsRes.data);
        setVisittypes(visitTypesRes.data);
        setUsers(usersRes.data);        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };
   
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      date,
      location_id,
      purpose,
      host_id,
      visit_type_id,
    } = formData;

    const errors = {};

    if (!first_name) errors.first_name = 'First name is required.';
    if (!last_name) errors.last_name = 'Last name is required.';
    if (!email) {
      errors.email = 'Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = 'Invalid email format.';
      }
    }
    if (!phone_number) {
      errors.phone_number = 'Phone number is required.';
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone_number)) {
        errors.phone_number = 'Phone number must be 10 digits.';
      }
    }
    if (!date) errors.date = 'Date is required.';
    if (!location_id) errors.location_id = 'Location is required.';
    if (!purpose) errors.purpose = 'Purpose of visit is required.';
    if (!host_id) errors.host_id = 'Host is required.';
    if (!visit_type_id) errors.visit_type_id = 'Visit type is required.';

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true); 
    try {
      const formattedDate = new Date(formData.date).toISOString().split('T')[0];  
      const formattedTime = new Date(formData.date).toTimeString().split(' ')[0];
      const dataToSend = {
        ...formData,
        visit_date: formattedDate,
        visit_time: formattedTime
      };
      console.log("Form Data being sent:", dataToSend);
      const response = await axios.post('http://localhost:5000/api/visits/create', dataToSend);
      console.log('response.data', response.data);
      const newVisitId = response?.data?.visit_id;     
      toast.success("Schedule visit created successfully!");
      resetForm();
      navigate(`/visitor/${newVisitId}`);
    } catch (error) {
      toast.error("Error creating schedule visit!");
      console.error("Error details:", error); 
    } finally {
      setLoading(false);
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
      purpose: '',
      host_id: '',
      visit_type_id: ''
    });
    setEditMode(false);
    setSelectedUserId(null);
  };


  return (
    <div className="container mt-2">
      <h3 className="text-center" style={{ textDecoration: 'underline' }}>Schedule Visit</h3>
      <form className="row g-3 mt-3" onSubmit={editMode ? handleUpdate : handleCreate}>
        <div className="col-md-6">
          <input type="text" className="form-control" id="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} style={{ paddingRight: '20px' }}/>
          {validationErrors.first_name && <div className="text-danger">{validationErrors.first_name}</div>}
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" id="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
          {validationErrors.last_name && <div className="text-danger">{validationErrors.last_name}</div>}
        </div>
        <div className="col-md-6">
          <input type="email" className="form-control" id="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
          {validationErrors.email && <div className="text-danger">{validationErrors.email}</div>}

        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" id="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} />
          {validationErrors.phone_number && <div className="text-danger">{validationErrors.phone_number}</div>}

        </div>
        <div className="col-md-6">
          <input type="datetime-local" className="form-control" id="date" value={formData.date} onChange={handleChange} />
          {validationErrors.date && <div className="text-danger">{validationErrors.date}</div>}

        </div>
        <div className="col-md-6">
          <select className="form-select" id="location_id" value={formData.location_id} onChange={handleChange}>
            <option value="" disabled>Location</option>
            {locations.map((location) => (
              <option key={location.location_id} value={location.location_id}>{location.location_name}</option>
            ))}
          </select>
          {validationErrors.location_id && <div className="text-danger">{validationErrors.location_id}</div>}

        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" id="purpose" placeholder="Purpose of Visit" value={formData.purpose} onChange={handleChange} />
          {validationErrors.purpose && <div className="text-danger">{validationErrors.purpose}</div>}

        </div>
        <div className="col-md-6">
          <select className="form-select" id="host_id" value={formData.host_id} onChange={handleChange}>
            <option value="" disabled>Host</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>
          {validationErrors.host_id && <div className="text-danger">{validationErrors.host_id}</div>}

        </div>

        <div className="col-md-6">
          <select className="form-select" id="visit_type_id" value={formData.visit_type_id} onChange={handleChange}>
            <option value="" disabled>Visit Type </option>
            
            {visittypes.map((visittype) => (
              <option key={visittype.visit_type_id} value={visittype.visit_type_id}>{visittype.visit_type}</option>
            ))}
          </select>
          {validationErrors.visit_type_id && <div className="text-danger">{validationErrors.visit_type_id}</div>}

        </div>
        <button type="submit" className="btn btn-primary mt-3" data-bs-dismiss="modal">
          {editMode ? 'Update' : 'Schedule'}
        </button>
      </form>
      {loading && (
  <div className="d-flex justify-content-center align-items-center vh-100" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: '9999' }}>
    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default SchedulevisitForm;
