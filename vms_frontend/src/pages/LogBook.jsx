import React from 'react'
import SchedulevisitForm from '../components/SchedulevisitForm';

function LogBook() {
  return (
    <div className="container">
        <h4 className="mb-0">LogBook</h4><br/>
        <div className="d-flex justify-content-between align-items-center mb-3">
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        + CREATE INVITE
      </button>
      <button type="button" className='d-line'  >
        Select Date
      </button>
      <button type="button"  >
       Search
      </button>
      </div> 
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="d-flex justify-content-end p-2">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <SchedulevisitForm  />
            </div>
          </div>
        </div>
        </div>
    </div>
  );
}

export default LogBook;