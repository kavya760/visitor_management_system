import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import SchedulevisitForm from '../components/SchedulevisitForm';
import axios from 'axios';

function Invitations() {
  const [users, setUsers] = useState([]);
  const [columns] = useState([
    { headerName: 'First Name', field: 'first_name' },
    { headerName: 'Last Name', field: 'last_name' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Phone Number', field: 'phone_number' },
    { headerName: 'Location ', field: 'location_name' },
    { headerName: 'Purpose of Visit', field: 'purpose_of_visit' },
    { headerName: 'Host ', field: 'user_first_name'},
    { headerName: 'Visit Type', field: 'visit_type' },
    {
      headerName: 'Actions',
      cellRendererFramework: (params) => (
        <div>
          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(params.data.user_id)}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(params.data.user_id)}>Delete</button>
        </div>
      )
    }
  ]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUpdateUsers = async () => {
    fetchUsers(); // Re-fetch the users after an update
  };

  const handleEdit = async (user_id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${user_id}`);
      // Use the response data to pre-fill the form, or handle it as needed
      console.log('Edit user data:', response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleDelete = async (user_id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/delete/${user_id}`);
      alert('User deleted successfully');
      fetchUsers(); // Re-fetch the users after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        Create schedule
      </button>

      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <SchedulevisitForm onUserUpdate={handleUpdateUsers} />
            </div>
          </div>
        </div>
      </div>

      <div className="ag-theme-quartz my-4" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={users}
          columnDefs={columns}
          pagination={true}
        />
      </div>
    </>
  );
}

export default Invitations;
