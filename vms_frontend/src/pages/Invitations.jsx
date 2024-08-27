import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgGridInvitations from '../components/AgGridInvitations';
import SchedulevisitForm from '../components/SchedulevisitForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation } from 'react-router-dom';
import api from '../api';
import { jwtDecode } from 'jwt-decode'

function Invitations() {
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();


  useEffect(() => {
 

  const fetchVisits = async () => {
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        console.error('No token found');
        setVisits([]);
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id; 
      const isAdmin = decodedToken.role_name === 'admin'; 

      const response = await api.get('/api/visits');
      if (isAdmin) {
        setVisits(response.data);
      } else if (userId) {
        const filteredVisits = response.data.filter(visit => visit.host.user_id === userId);
        setVisits(filteredVisits);
      } else {
        setVisits([]);
      }
    } catch (error) {
      setError('Failed to fetch visits');
      console.error(error); 
    }
  };
  fetchVisits();
}, []);

 
  const updateVisitStatus = async (id, status) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/visits/update/${id}`, { status }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const newStatus = status === 'approved' ? 'Approved' : 'Rejected';

        if (response.data.message === 'Status updated successfully') {
            const updatedRowData = visits.map(row => {
                if (row.visit_id === id) {
                    return { ...row, status: status === 'approved' ? 'Approved' : 'Rejected' };
                }
                return row;
            });
            setVisits(updatedRowData); 
            toast.success(`Visit ${status} successfully!`);
        }
    } catch (error) {
        toast.error(`Error updating visit status: ${error.message}`);
        console.error(`Error updating visit status:`, error);
    }
};


  const handleDataChange = () => {
    fetchVisits();
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex align-items-center justify-content-start">
        <h4 className="mb-0">Invitations</h4>
        <ol className="breadcrumb m-0 ms-3">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">
            Invitations
          </li>
        </ol>
      </div>
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
        style={{ padding: '4px 8px', fontSize: '15px' }}>
        Schedule Visit
      </button>
      </div>  
      <AgGridInvitations rowData={visits} updateVisitStatus={updateVisitStatus} />
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="d-flex justify-content-end p-2">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <SchedulevisitForm onChange={handleDataChange} />
            </div>
          </div>
        </div>
        </div>
    </div>
  );
}

export default Invitations;