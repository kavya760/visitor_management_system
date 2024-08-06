import React from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function AgGridUsers({ rowData }) {
    const columnDefs = [
        { headerName: "User Id", field: "user_id", sortable: true, filter: true },
        { headerName: "FirstName", field: "first_name ", sortable: true, filter: true },
        { headerName: "LastName", field: "last_name", sortable: true, filter: true },
        { headerName: "Email", field: "email", sortable: true, filter: true},
        { headerName: "Role Id", field: "role_id ", sortable: true, filter: true},
        { headerName: "PhoneNumber", field: "phone_number", sortable: true, filter: true},
    ];
    
  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
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