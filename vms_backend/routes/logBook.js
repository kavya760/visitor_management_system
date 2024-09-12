const express = require('express');
const router = express.Router();
const getVisitById = require('../utilities/deserialize');
const sendEmail = require('../sendMail')
const generateEmailCheckin = require('../checkinEmailTemplate');

router.put('/:id', async (req, res) => {
    const visit_id = req.params.id;
    const { action } = req.body; 
    const currentTime = new Date();

    try {
        // Fetch visit details
        const visit = await getVisitById(req.db, visit_id);

        if (!visit) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        if (action === 'checkin') {
            await req.db.query('UPDATE visits SET checkin_time = ? WHERE visit_id = ?', [currentTime, visit_id]);

            // Generate email content
            const emailContent = generateEmailCheckin(visit);
            
            // Send email
            await sendEmail(visit.visitor.email, 'Check-in Confirmation', emailContent);

            res.status(200).send('Check-in time updated and email sent successfully');
        } else if (action === 'checkout') {
            await req.db.query('UPDATE visits SET checkout_time = ? WHERE visit_id = ?', [currentTime, visit_id]);
            res.status(200).send('Check-out time updated successfully');
        } else {
            res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('Error updating time:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
