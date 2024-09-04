const express = require('express');
const router = express.Router();

router.get('/api/dashboard', async (req, res) => {
    const { date } = req.query;
    
    const selectedDate = date || new Date().toISOString().slice(0, 10);

    try {
        const today = new Date().toISOString().slice(0, 10);

        const approvedQuery = `
            SELECT COUNT(*) AS approved_count
            FROM visits
            WHERE visit_date = ? AND status = 'approved';
        `;
        const [approvedRows] = await req.db.query(approvedQuery, [selectedDate]);

        const rejectedQuery = `
            SELECT COUNT(*) AS rejected_count
            FROM visits
            WHERE visit_date = ? AND status = 'rejected';
        `;
        const [rejectedRows] = await req.db.query(rejectedQuery, [selectedDate]);

        const pendingQuery = `
            SELECT COUNT(*) AS pending_count
            FROM visits
            WHERE visit_date = ? AND status = 'pending';
        `;
        const [pendingRows] = await req.db.query(pendingQuery, [selectedDate]);

        const completedQuery = `
            SELECT COUNT(*) AS completed_meetings
            FROM visits
            WHERE visit_date = ? AND checkin_time IS NOT NULL AND checkout_time IS NOT NULL;
        `;
        const [completedRows] = await req.db.query(completedQuery, [selectedDate]);

        res.json({
                approved_count_visit: approvedRows[0].approved_count,
                rejected_count_visit: rejectedRows[0].rejected_count,
                pending_count_visit: pendingRows[0].pending_count,
                completedMeetings_visit: completedRows[0].completed_meetings
        });
    } catch (error) {
        console.error('Error fetching visits:', error.message);
        console.error(error.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
