import React from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

function AgGridUsers({ rowData, onUpdate, onDelete }) {
    const columnDefs = [
        { headerName: "User Id", field: "user_id", sortable: true, filter: true },
        { headerName: "FirstName", field: "first_name", sortable: true, filter: true },
        { headerName: "LastName", field: "last_name", sortable: true, filter: true },
        { headerName: "Email", field: "email", sortable: true, filter: true},
        { headerName: "Role Name", field: "role_name", sortable: true, filter: true},
        { headerName: "PhoneNumber", field: "phone_number", sortable: true, filter: true},
        {
          headerName: "Action",
          field: "action",
          cellRenderer: (params) => (
              <div>
                  <button 
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => onUpdate(params.data)} 
                  >
                      Update
                  </button>
                  <button 
                      onClick={() => onDelete(params.data)} 
                      className="btn btn-danger btn-sm"
                  >
                      Delete
                  </button>
              </div>
          ),
          sortable: false,
          filter: false,
          width: 200
      }
  ];
    
  return (
    
    <div className="ag-theme-quartz" style={{ height: 400, width: "100%" }}>
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}
      rowSelection="multiple" 
      pagination={true}
      paginationPageSize={10} 
      paginationPageSizeSelector={false} 
      
    />
  </div>
  )
}

export default AgGridUsers;