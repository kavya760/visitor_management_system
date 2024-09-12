import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function VisitorPass() {
  const { visitId } = useParams();
  const [visitDetails, setVisitDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisitDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/visits/${visitId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch visit details');
        }
        const data = await response.json();
        setVisitDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitDetails();
  }, [visitId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!visitDetails) return <div>No visit details available</div>;

  return (
    <div style={{
      fontFamily: 'Times New Roman, serif',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '15px',
      maxWidth: '500px',
      margin: 'auto',
      backgroundColor: 'white',
      marginTop: '20px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#003366',
        fontSize: '2.7rem',
        marginBottom: '20px',
        padding: '5px',
        borderRadius: '5px'
      }}>
        Visitor Pass
      </h1>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
      }}>
        <tbody>
          <tr>
            <td style={{
              padding: '12px',
              border: '1px solid #ddd',
              fontWeight: 'bold',
              backgroundColor: '#E5E4E2'
            }}>
              Visitor Name:
            </td>
            <td style={{
              padding: '12px',
              border: '1px solid #ddd'
            }}>
              {visitDetails.visitor.first_name} {visitDetails.visitor.last_name}
            </td>
          </tr>
          <tr>
            <td style={{
              padding: '12px',
              border: '1px solid #ddd',
              fontWeight: 'bold',
              backgroundColor: '#E5E4E2'
            }}>
              Visitor Email:
            </td>
            <td style={{
              padding: '12px',
              border: '1px solid #ddd'
            }}>
              {visitDetails.visitor.email}
            </td>
          </tr>
          <tr>
            <td style={{
              padding: '12px',
              border: '1px solid #ddd',
              fontWeight: 'bold',
              backgroundColor: '#E5E4E2'
            }}>
              Host Name:
            </td>
            <td style={{
              padding: '12px',
              border: '1px solid #ddd'
            }}>
              {visitDetails.host.first_name} {visitDetails.host.last_name}
            </td>
          </tr>
          <tr>
            <td style={{
              padding: '12px',
              border: '1px solid #ddd',
              fontWeight: 'bold',
              backgroundColor: '#E5E4E2'
            }}>
              Location:
            </td>
            <td style={{
              padding: '12px',
              border: '1px solid #ddd'
            }}>
              {visitDetails.location_name}
            </td>
          </tr>
          <tr>
            <td style={{
              padding: '12px',
              border: '1px solid #ddd',
              fontWeight: 'bold',
              backgroundColor: '#E5E4E2'
            }}>
              Purpose:
            </td>
            <td style={{
              padding: '12px',
              border: '1px solid #ddd'
            }}>
              {visitDetails.purpose}
            </td>
          </tr>
          <tr>
            <td style={{
              padding: '12px',
              border: '1px solid #ddd',
              fontWeight: 'bold',
              backgroundColor: '#E5E4E2'
            }}>
              Visit Date:
            </td>
            <td style={{
              padding: '12px',
              border: '1px solid #ddd'
            }}>
              {visitDetails.visit_date}
            </td>
          </tr>
          <tr>
            <td style={{
              padding: '12px',
              border: '1px solid #ddd',
              fontWeight: 'bold',
              backgroundColor: '#E5E4E2'
            }}>
              Visit Time:
            </td>
            <td style={{
              padding: '12px',
              border: '1px solid #ddd'
            }}>
              {visitDetails.visit_time}
            </td>
          </tr>
        </tbody>
      </table>
    <div>
    </div>
    </div>
  );
}

export default VisitorPass;
