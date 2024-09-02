const formatTime = (time) => {
    if (!time) return 'Not Checked In';
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
};


const generateEmailBody = (allVisits) => {
    if (!allVisits) {
        return `<p>No visit details available.</p>`;
    }
    const visitorFirstName = allVisits.visitor?.first_name || '';
    const visitorLastName = allVisits.visitor?.last_name || '';
    const visitorName = `${visitorFirstName} ${visitorLastName}`.trim();
    
    const hostFirstName = allVisits.host?.first_name || '';
    const hostLastName = allVisits.host?.last_name || '';
    const hostName = `${hostFirstName} ${hostLastName}`.trim();

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
          <h1 style="text-align: center; color: #333;">Visitor Confirmation</h1>
          <center><p>Your visit has been <strong>${allVisits?.status}</strong>.</p></center>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Status:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${allVisits?.status}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Visitor Name:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">
                  ${visitorName}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Visitor Email:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">
                  ${allVisits.visitor?.email || 'Not Provided'}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Check-In Time:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">
                  ${formatTime(allVisits.checkin_time) || 'Not Checked In'}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Host Name:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">
                  ${hostName}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Location:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">
                  ${allVisits.location_name || 'Not Provided'}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Purpose:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">
                  ${allVisits.purpose || 'Not Specified'}
                </td>
              </tr>
            </tbody>
          </table>
          <div style="text-align: center; margin-top: 20px;">
            <a href="#" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Details</a>
          </div>
        </div>
    `;
};

module.exports = generateEmailBody;
