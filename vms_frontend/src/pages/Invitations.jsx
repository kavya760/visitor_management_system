import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgGridInvitations from '../components/AgGridInvitations';
import SchedulevisitForm from '../components/SchedulevisitForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Invitations() {
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
  
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/visits'); 
      setVisits(response.data);
    } catch (error) {
      console.error('Error fetching visits:', error);
      setError('Failed to fetch visits');
    }
  };

  const updateVisitStatus = async (id, status) => {
    try {
        console.log(`Updating visit with ID ${id} and status ${status}`);
        const response = await axios.put(`http://localhost:5000/api/visits/update/${id}`, { status }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("status:", status);
        const newStatus = status === 'approved' ? 'Approved' : 'Rejected';
        console.log("newstatus:", newStatus);

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
        <h4 className="mb-0">Invitations</h4>
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
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