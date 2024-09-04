import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Pikaday from 'pikaday';

const Dashboard = () => {
    const [visitCounts, setVisitCounts] = useState({
        pending_count_visit: 0,
        approved_count_visit: 0,
        rejected_count_visit: 0,
        completedMeetings_visit: 0,
    });
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
      const fetchVisitCounts = async () => {
        try {
            console.log("Fetching visit counts for date:", selectedDate);
            const response = await axios.get('/api/dashboard', {
                params: { date: selectedDate }
            });
            console.log("API response:", response.data);
            setVisitCounts(response.data);
        } catch (error) {
            console.error('Error fetching visit counts:', error);
        }
    };
    
    fetchVisitCounts();
  }, [selectedDate]);

    useEffect(() => {
        const picker = new Pikaday({
            field: document.getElementById('datepicker'),
            format: 'DD-MM-YYYY',
            onSelect: (date) => {
                const formattedDate = moment(date).format('YYYY-MM-DD');
                setSelectedDate(formattedDate);
            },
        });

        return () => {
            picker.destroy();
        };
    }, []);

    useEffect(() => {
      if (!selectedDate) {
          const today = moment().format('YYYY-MM-DD');
          setSelectedDate(today);
      }
  }, [selectedDate]);

  const isToday = moment(selectedDate).isSame(moment(), 'day');

    return (
        <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <h4 className="mb-0">Dashboard</h4>
                    <ol className="breadcrumb m-0 ms-3">
                        <li className="breadcrumb-item">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="breadcrumb-item active">
                            Dashboard
                        </li>
                    </ol>
                </div>
                <div className="input-group input-group-sm" style={{ maxWidth: '200px' }}>
                    <input
                        id="datepicker"
                        className="form-control"
                        placeholder="Select Date"
                        aria-label="Select Date"
                    />
                    <span className="input-group-text">
                        <i className="bi bi-calendar-event"></i>
                    </span>
                </div>
            </div>
            <br /><br />
            <div className="row justify-content-center">
                <div className="col-lg-2 col-md-3 col-sm-5 col-6 mb-4 me-5">
                    <div className="card text-center p-5">
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                          <b> <h3 className="card-title mb-2 text-center" ><b>{visitCounts.pending_count_visit || 0}</b></h3></b><br />
                            <p className="small text-dark">
                            <i className="fas fa-calendar-alt"></i> {isToday ? 'Today' : moment(selectedDate).format('DD MMM YYYY')}
                            </p>
                            <div className="icon my-2">
                                <i className="fas fa-hourglass-half fa-2x" style={{ fontSize: '1.2rem' }}></i>
                            </div>
                           <b> <p className="card-text" >Pending Visits</p></b>
                        </div>
                    </div>
                </div>
                <div className="col-lg-2 col-md-3 col-sm-5 col-6 mb-4 me-5">
                    <div className="card text-center p-5">
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                           <b> <h3 className="card-title mb-2" ><b>{visitCounts.approved_count_visit || 0}</b></h3></b><br />
                            <p className="small text-dark">
                            <i className="fas fa-calendar-alt"></i> {isToday ? 'Today' : moment(selectedDate).format('DD MMM YYYY')}
                            </p>
                            <div className="icon my-2">
                                <i className="fas fa-check-circle fa-2x" style={{ fontSize: '1.3rem' }}></i>
                            </div>
                           <b> <p className="card-text" >Accepted Visits</p></b>
                        </div>
                    </div>
                </div>
                <div className="col-lg-2 col-md-3 col-sm-5 col-6 mb-4 me-5">
                    <div className="card text-center p-5">
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <b><h3 className="card-title mb-2" ><b>{visitCounts.rejected_count_visit || 0}</b></h3></b><br />
                            <p className="small text-dark">
                            <i className="fas fa-calendar-alt"></i> {isToday ? 'Today' : moment(selectedDate).format('DD MMM YYYY')}
                            </p>
                            <div className="icon my-2">
                                <i className="fas fa-times-circle fa-2x" style={{ fontSize: '1.3rem' }}></i>
                            </div>
                           <b> <p className="card-text" >Rejected Visits</p></b>
                        </div>
                    </div>
                </div>
                <div className="col-lg-2 col-md-3 col-sm-5 col-6 mb-4 me-5">
                    <div className="card text-center p-5">
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                           <b> <h3 className="card-title mb-2" ><b>{visitCounts.completedMeetings_visit || 0}</b></h3></b><br />
                            <p className="small text-dark">
                            <i className="fas fa-calendar-alt"></i> {isToday ? 'Today' : moment(selectedDate).format('DD MMM YYYY')}
                            </p>
                            <div className="icon my-2">
                                <i className="fas fa-calendar-check fa-2x" style={{ fontSize: '1.2rem' }}></i>
                            </div>
                            <b><p className="card-text" >Completed Meetings</p></b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
