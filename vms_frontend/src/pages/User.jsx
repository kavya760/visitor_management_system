import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgGridUsers from '../components/AgGridUsers'; 

function User() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get_users'); 
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <AgGridUsers rowData={users} />
    </div>
  );
}

export default User;
