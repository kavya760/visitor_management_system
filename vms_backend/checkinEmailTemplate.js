const formatTime = (time) => {
    if (!time) return 'Not Checked In';
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${hours}:${minutes}`;
  };
  
  const generateEmailCheckin = (allVisits) => {
    if (!allVisits) {
        return `<p>No visit details available.</p>`;
    }
  
    const visitorFirstName = allVisits.visitor?.first_name || '';
    const visitorLastName = allVisits.visitor?.last_name || '';
    const visitorName = `${visitorFirstName} ${visitorLastName}`.trim();
    
    const hostFirstName = allVisits.host?.first_name || '';
    const hostLastName = allVisits.host?.last_name || '';
    const hostName = `${hostFirstName} ${hostLastName}`.trim();
  
    const currentDateTime = new Date();
    const currentDate = currentDateTime.toLocaleDateString();
    const currentTime = formatTime(currentDateTime);
  
    const visitDetailsLink = `http://localhost:5173/visitor/${allVisits.visit_id}`;
  
    return `
          <p>Your visit has been successfully checked in.</p>
        <p>Here are the details of the visit:</p>
          <h1 style="text-align: center; color: #003366;">Visitor Details</h1>
          <table style="width: 30%; border-collapse: collapse; margin: auto;">
            <tbody>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #E5E4E2;">Visitor Name:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                   ${visitorName}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #E5E4E2;">Visitor Email:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                  ${allVisits.visitor?.email || 'Not Provided'}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #E5E4E2;">Date:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                ${currentDate}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #E5E4E2;">Check in:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                ${currentTime}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #E5E4E2;">Host Name:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                ${hostName}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #E5E4E2;">Location:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                  ${allVisits.location_name || 'Not Provided'}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #E5E4E2;">Purpose:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                  ${allVisits.purpose || 'Not Specified'}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #E5E4E2;">Visit Type:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                  ${allVisits.visit_type || 'Not Specified'}
                </td>
              </tr>
            </tbody>
          </table>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${visitDetailsLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Details</a>
          </div>
          <p>If you need to make changes to the schedule, please contact us.</p>
      <p>Thank you,<br>[VMS]</p>
        
    `;
  };
  
  module.exports = generateEmailCheckin;
  