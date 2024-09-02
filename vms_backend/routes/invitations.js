const express = require('express');
const router = express.Router();
const sendEmail = require('../sendMail')
const generateEmailBody = require('../emailTemplate');
const getVisitById = require('../utilities/deserialize');

router.put('/update/:id', async (req, res) => {
    console.log('Update route handler started');
    const { id } = req.params;
    const { status } = req.body;

    console.log('Request Params:', req.params);
    console.log('Request Body:', req.body);

    const selectQuery = 'SELECT * FROM visits WHERE visit_id = ?';
    try {
        const [rows] = await req.db.query(selectQuery, [id]);

        if (rows.length === 0) {
            console.log('No visit found with the given ID');
            return res.status(404).json({ error: 'Visit not found' });
        }

        const updateQuery = 'UPDATE visits SET status = ? WHERE visit_id = ?';
        const [updateResult] = await req.db.query(updateQuery, [status, id]);
        console.log("Updating result:", updateResult);

        if (updateResult.affectedRows === 0) {
            console.log('No rows updated');
            return res.status(404).json({ error: 'Visit not found' });
        }

        const visit = rows[0];
        const visit_serialized= await getVisitById(req.db,id); 
        console.log("asasd",visit_serialized)

        const emailSubject = status === 'approved'
            ? 'Your Visit has been Approved'
            : 'Your Visit has been Rejected';
            
        res.json({ message: 'Status updated successfully. Email will be sent shortly.' });
        const emailBody = generateEmailBody(visit_serialized);
        console.log('Email Subject:', emailSubject);
        // console.log('Email Body:', emailBody);

        try {
            await sendEmail("kavyargowda223@gmail.com", emailSubject, emailBody);
            console.log('Email sent successfully');
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }

    } catch (err) {
        console.error('Error updating visit status:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to update visit status' });
        }
    }
});


module.exports = router;




