import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgGridInvitations from '../components/AgGridInvitations';
import SchedulevisitForm from '../components/SchedulevisitForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function Invitations() {
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/visits'); 
        setVisits(response.data);
      } catch (error) {
        console.error('Error fetching visits:', error);
        setError('Failed to fetch visits');
      }
    };

    fetchVisits();
  }, []);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Invitations</h4>
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        Schedule Visit
      </button>
      </div>  
      <AgGridInvitations rowData={visits} />
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
    </div>
  );
}

export default Invitations;