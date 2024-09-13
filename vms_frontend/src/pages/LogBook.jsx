import React, { useState, useEffect } from 'react';
import SchedulevisitForm from '../components/SchedulevisitForm';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';
import moment from 'moment';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'

function LogBook() {
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const location = useLocation();


  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          setRowData([]);
          return;
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;
        const isAdmin = decodedToken.role_name === 'admin'; 

        const response = await axios.get('http://localhost:5000/api/visits');
        const visits = response.data;

        const processedData = visits.map(visit => {
          const { checkin_time, checkout_time } = visit;
          let duration = 'N/A';

          if (checkin_time && checkout_time) {
            const checkin = moment(checkin_time);
            const checkout = moment(checkout_time);
            duration = checkout.diff(checkin, 'minutes');
          }

          return { ...visit, duration };
        });

        let filteredData;

        if (isAdmin) {
          filteredData = processedData;
        } else {
          filteredData = processedData.filter(
            visit => visit.host.user_id === userId && visit.status === 'Approved'
          );
        }

        setRowData(filteredData);
        setFilteredData(filteredData);
      } catch (error) {
        console.error('Error fetching visits:', error);
        setError('Failed to fetch visits.');
      }
    };

    fetchVisits();
  }, []);

  const handleDataChange = (visitId, action, time) => {
    setRowData(prevRowData =>
      prevRowData.map(visit => {
        if (visit.visit_id === visitId) {
          if (action === 'checkin') {
            return { ...visit, checkin_time: time };
          } else if (action === 'checkout') {
            return { ...visit, checkout_time: time };
          }
        }
        return visit;
      })
    );
  };
 
  useEffect(() => {
    const picker = new Pikaday({
      field: document.getElementById('datepicker'),
      format: 'DD-MM-YYYY',
      onSelect: (date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        setSelectedDate(formattedDate);
        console.log("Selected Date (in YYYY-MM-DD format):", formattedDate); 
      },  
    });

    return () => {
      picker.destroy();
    };
  }, []);


  useEffect(() => {
    let filteredData = rowData;

    if (selectedFilter.length === 0) {
      filteredData = filteredData.filter(visit => visit.status === 'Approved');
    } else {
      if (selectedFilter.includes('all')) {
        filteredData = [...rowData];  
      } else {
        if (selectedFilter.includes('checkedin')) {
          filteredData = filteredData.filter(visit => visit.checkin_time); 
        }
        if (selectedFilter.includes('checkedout')) {
          filteredData = filteredData.filter(visit => visit.checkout_time); 
        }
        
        filteredData = filteredData.filter(visit => visit.status === 'Approved');
      }
    }

if (selectedDate) {
    filteredData = filteredData.filter(visit => moment(visit.visit_date).format('YYYY-MM-DD') === selectedDate);  
  }

    setFilteredData(filteredData);
  }, [selectedFilter, rowData, selectedDate]);

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
  
    setSelectedFilter(checked ? [value] : []);
  };
  

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchText(searchTerm);
    const filteredData = rowData.filter((visit) => {
      const visitor = `${visit.visitor.first_name} ${visit.visitor.last_name}`.toLowerCase();
      const host = `${visit.host.first_name} ${visit.host.last_name}`.toLowerCase();
      return visitor.includes(searchTerm) || host.includes(searchTerm);
    });
    setFilteredData(filteredData);
  };
  
  const ActionCellRenderer = (props) => {
    const [isCheckin, setIsCheckin] = useState(!!props.data.checkin_time);
    const [checkinTime, setCheckinTime] = useState(props.data.checkin_time);
    const [isCheckout, setIsCheckout] = useState(!!props.data.checkout_time);
    const [checkoutTime, setCheckoutTime] = useState(props.data.checkout_time);

    const handleCheckin = async () => {
        const action = 'checkin';
        try {
            const response = await axios.put(`http://localhost:5000/api/visits/${props.data.visit_id}`, { action });
            if (response.status === 200) {
                const time = moment().format();
                setCheckinTime(time);
                setIsCheckin(true);
                toast.success("Checked in successfully!");
                props.onChange(props.data.visit_id, 'checkin', time);
            }
        } catch (error) {
            toast.error("Error during check-in!");
            console.error('Error saving check-in time:', error);
        }
    };

    const handleCheckout = async () => {
        if (!isCheckin) { 
            console.warn('Cannot check out before checking in.');
             toast.warn('Cannot check out before checking in.');
            return;
        }
        const action = 'checkout';
        try {
            const response = await axios.put(`http://localhost:5000/api/visits/${props.data.visit_id}`, { action });
            if (response.status === 200) {
                const time = moment().format();
                setCheckoutTime(time);
                setIsCheckout(true);
                toast.success("Checked out successfully!");
                props.onChange(props.data.visit_id, 'checkout', time);
            }
        } catch (error) {
            toast.error("Error during check-out!");
            console.error('Error saving check-out time:', error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
            {props.colDef.field === 'checkin_time' && (
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
                        <span>{moment(checkinTime).format('hh:mm A')}</span>
                    )}
                </>
            )}
            {props.colDef.field === 'checkout_time' && (
                <>
                    {!isCheckout ? (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleCheckout}
                            style={{ padding: '2px 6px', fontSize: '12px' }}
                            disabled={!isCheckin}
                        >
                            CHECK OUT
                        </button>
                    ) : (
                        <span>{moment(checkoutTime).format('hh:mm A')}</span>
                    )}
                </>
            )}
        </div>
    );
};


  const columnDefs = [
    { headerName: 'Visitor', field: 'visitor_name', valueGetter: (params) => `${params.data.visitor.first_name} ${params.data.visitor.last_name}` },
    { headerName: 'Host', field: 'host_name', valueGetter: (params) => `${params.data.host.first_name} ${params.data.host.last_name}` },
    { headerName: 'Check in', field: 'checkin_time', cellRenderer: (params) => (
      <ActionCellRenderer {...params} onChange={handleDataChange} /> )},
    { headerName: 'Check out', field: 'checkout_time', cellRenderer: (params) => (
      <ActionCellRenderer {...params} onChange={handleDataChange} />)},
    { headerName: 'Duration', field: 'duration',  valueGetter: (params) => {
      const durationInMinutes = params.data.duration;
  
      if (durationInMinutes === 'N/A' || durationInMinutes === undefined) {
        return 'N/A';
      }
  
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      if(!hours){
        return `${minutes} mins`;
      }else{
        return `${hours} hrs ${minutes} mins`;}
    } },
  ];

  return (
    <div className="container">
        <div className="d-flex align-items-center justify-content-start">
        <h4 className="mb-0">Logbook</h4>
        <ol className="breadcrumb m-0 ms-3">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">
            Logbook
          </li>
        </ol>
      </div>
      <br/>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
          style={{ padding: '3px 7px', fontSize: '13px' }}>
           CREATE INVITE +
        </button>
        <div className="d-flex ms-auto align-items-center">
          <div className="input-group input-group-sm me-2">
            <input id="datepicker" className="form-control" placeholder="Select Date" aria-label="Select Date" />
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
      <br />
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
              checked={selectedFilter.includes('all')}
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
              id="checkedin" 
              value="checkedin" 
              checked={selectedFilter.includes('checkedin')}
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
              checked={selectedFilter.includes('checkedout')}
              onChange={handleFilterChange}
            />
            <label className="form-check-label" htmlFor="checkedout">
              Checked Out
            </label>
          </div>
        </div>
        <div className="col-9">
          <div className="ag-theme-quartz" style={{ height: 400, width: '100%' }}>
            <AgGridReact
              rowData={filteredData}
              columnDefs={columnDefs}
              rowSelection="multiple"
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={false}
              overlayNoRowsTemplate={`<span>${error ? error : 'No approved visits found'}</span>`}

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
