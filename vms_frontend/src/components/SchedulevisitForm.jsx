import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function SchedulevisitForm() {
  const [locations, setLocations] = useState([]);
  const [visittypes, setVisittypes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedVisitType, setSelectedVisitType] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsRes, visitTypesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/locations'),
          axios.get('http://localhost:5000/api/visittypes'),
        ]);
         
        setLocations(locationsRes.data);
        setVisittypes(visitTypesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };
    fetchData();
  }, []);

  console.log("locations", locations);
  console.log("VisitTypes", visittypes);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleVisitTypeChange = (e) => {
    setSelectedVisitType(e.target.value);
  };

  return (
    <div className="container mt-2">
      <h3 className="text-center" style={{ textDecoration: 'underline' }}>Schedule Visit</h3>
      <form className="row g-3 mt-3">
        <div className="col-md-6">
          <input type="text" className="form-control" id="fname" placeholder="First Name*" />
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" id="lname" placeholder="Last Name*" />
        </div>
        <div className="col-md-6">
          <input type="email" className="form-control" id="email" placeholder="Email Address*" />
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" id="phno" placeholder="Phone Number*" />
        </div>
        <div className="col-md-6">
          <input type="datetime-local" className="form-control" id="date" placeholder="Choose Date and Time" />
        </div>

        <div className="col-md-6">
          <select className="form-select" id="location" value={selectedLocation} onChange={handleLocationChange}>
          <option value="" disabled>Location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>{location.location_name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <input type="text" className="form-control" id="purposeofvisit" placeholder="Purpose of Visit*" />
        </div>

        <div className="col-md-6">
          <input type="text" className="form-control" id="purposeofvisit" placeholder="Host" />
        </div>

        <div className="col-md-6">
          <select className="form-select" id="visittype" value={selectedVisitType} onChange={handleVisitTypeChange}>
            <option value="" disabled>Visit Type</option>
            {visittypes.map((visittype) => (
              <option key={visittype.id} value={visittype.id}>{visittype.visit_type}</option>
            ))}
          </select>
        </div>

        <button type="button" className="btn btn-primary mt-3" data-bs-dismiss="modal">Schedule</button>
      </form>
    </div>
  );
}

export default SchedulevisitForm;
