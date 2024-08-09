import React, { useState, useEffect } from 'react';
import SchedulevisitForm from '../components/SchedulevisitForm';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';
import moment from 'moment';

function LogBook() {
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/visits'); 
        const filteredData = response.data.filter(visits => visits.status === 'Approved'); 
        setRowData(filteredData);
        setFilteredData(filteredData);
      } catch (error) {
        console.error('Error fetching visits:', error);
        setError('Failed to fetch visits');
      }
    };
    fetchVisits();
  }, []);

  useEffect(() => {
    const picker = new Pikaday({
      field: document.getElementById('datepicker'),
      format: 'YYYY-MM-DD'
    });

    return () => {
      picker.destroy();
    };
  }, []);

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchText(searchTerm);
    const filteredData = rowData.filter((visits) => {
      const visitor = `${visits.visitor.first_name} ${visits.visitor.last_name}`.toLowerCase();
      const host = `${visits.host.first_name} ${visits.host.last_name}`.toLowerCase();
      return visitor.includes(searchTerm) || host.includes(searchTerm);
    });
    setFilteredData(filteredData);
  };

  const ActionCellRenderer = (props) => {
     console.log('sasas',props.data.visit_id);
    const [isCheckin, setIsCheckin] = useState(false);
    const [checkinTime, setCheckinTime] = useState('');
    const [isCheckout, setIsCheckout] = useState(false);

    const handleCheckin = () => {
      const time = moment().format('hh:mm A');
      setCheckinTime(time);
      setIsCheckin(true);
      try {
         axios.put(`http://localhost:5000/api/visits/checkin_time/${props.data.visit_id}`, {
          checkin_time: time,
        });
      } catch (error) {
        console.error('Error saving check-in time:', error);
      }
    };

    const handleCheckout = () => {
      setIsCheckout(true); 
    };

    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
        {props.colDef.field === 'checkin' && (
        <>
          {!isCheckin ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleCheckin}
              style={{ padding: '2px 6px', fontSize: '12px' }}
            >
              CHECK IN
            </button>
          ) : (
            <span>{checkinTime}</span> 
          )}
        </>
      )}
        {props.colDef.field === 'checkout' && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleCheckout}
            disabled={isCheckout}
            style={{ padding: '2px 6px', fontSize: '12px' }}
          >
            CHECK OUT
          </button>
        )}
      </div>
    );
  };

  const columnDefs = [
    { headerName: 'Visitor', field: 'visitor_name',
      valueGetter: (params) => `${params.data.visitor.first_name} ${params.data.visitor.last_name}` },
    { headerName: 'Host', field: 'host_name', 
      valueGetter: (params) => `${params.data.host.first_name} ${params.data.host.last_name}` },
    { headerName: 'Confirmation ID', field: 'confirmation' },
    { headerName: 'Check in', field: 'checkin', cellRenderer: ActionCellRenderer },
    { headerName: 'Check out', field: 'checkout', cellRenderer: ActionCellRenderer },
    { headerName: 'Duration', field: 'duration' },
  ];

  return (
    <div className="container">
      <h4 className="mb-0">LogBook</h4><br/>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
        style={{ padding: '3px 7px', fontSize: '13px' }}>
          + CREATE INVITE
        </button>
        <div className="d-flex ms-auto align-items-center">
          <div className="input-group input-group-sm me-2">
            <input id="datepicker" className="form-control" placeholder="Select Date" aria-label="Select Date"/>
            <span className="input-group-text">
              <i className="bi bi-calendar-event"></i>
            </span>
          </div>
          <div className="input-group input-group-sm">
            <input
              className="form-control"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
        </div> 
      </div>
      <br/>
      <div className="row">
        <div className="col-3">
          <h3>Filters</h3>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="filterOptions"
              id="all"
              value="all"
              checked={selectedFilter === 'all'}
              onChange={handleFilterChange}
            />
            <label className="form-check-label" htmlFor="all">
              All
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="filterOptions"
              id="expected"
              value="expected"
              checked={selectedFilter === 'expected'}
              onChange={handleFilterChange}
            />
            <label className="form-check-label" htmlFor="expected">
              Expected
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="filterOptions"
              id="checkedin"
              value="checkedin"
              checked={selectedFilter === 'checkedin'}
              onChange={handleFilterChange}
            />
            <label className="form-check-label" htmlFor="checkedin">
              Checked In
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="filterOptions"
              id="checkedout"
              value="checkedout"
              checked={selectedFilter === 'checkedout'}
              onChange={handleFilterChange}
            />
            <label className="form-check-label" htmlFor="checkedout">
              Checked Out
            </label>
          </div>
        </div>
        <div className="col-9">
          <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
              rowData={filteredData}
              columnDefs={columnDefs}
              rowSelection="multiple"
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={true}
            />
          </div>
        </div>
      </div>
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

export default LogBook;
