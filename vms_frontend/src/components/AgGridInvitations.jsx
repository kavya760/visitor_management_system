import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const AgGridInvitations = ({ rowData, updateVisitStatus}) => {
  console.log("Row Data:", rowData);
  
  const ActionCellRenderer = (props) => {
    const { data } = props;

    const handleApprove = () => {
      updateVisitStatus(data.visit_id, 'approved');
    };

    const handleReject = () => {
      updateVisitStatus(data.visit_id, 'rejected');
    };

    return (
       <div className="action-buttons">
      <button onClick={handleApprove} className="btn btn-primary btn-sm me-2">Approve</button>
      <button onClick={handleReject} className="btn btn-danger btn-sm">Reject</button>
    </div>
        );
      };

  const columnDefs = [
    { headerName: "Visitor Name",
      field: "visitor_name",
      sortable: true,
      filter: true,
      valueGetter: (params) => `${params.data.visitor.first_name} ${params.data.visitor.last_name}` },
    { headerName: "Visit_Date", field: "visit_date", sortable: true, filter: true },
    { headerName: "Visit_Time", field: "visit_time", sortable: true, filter: true },
    { headerName: "Host Name",
      field: "host_name",
      sortable: true,
      filter: true,
      valueGetter: (params) => `${params.data.host.first_name} ${params.data.host.last_name}` },
    { headerName: "Purpose", field: "purpose", sortable: true, filter: true },
    { headerName: "Location", field: "location_name", sortable: true, filter: true },
    { headerName: "Visit_Type", field: "visit_type", sortable: true, filter: true },
    { headerName: "Status", field: "status", sortable: true, filter: true },
    { 
      headerName: "Action", 
      field: "action",  
      sortable: false, 
      filter: false, 
      cellRenderer: ActionCellRenderer,
      width: 200 
    }
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection="multiple"
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={true}
      />
    </div>
  );
};

export default AgGridInvitations;
