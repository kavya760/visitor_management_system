const express = require('express');
const router = express.Router();

router.put('/:id', async (req, res) => {
    const visit_id = req.params.id;
    const { action } = req.body; 
    const currentTime = new Date();

    const selectQuery = 'SELECT * FROM visits WHERE visit_id = ?';
    try {
        const [rows] = await req.db.query(selectQuery, [visit_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        if (action === 'checkin') {
            await req.db.query('UPDATE visits SET checkin_time = ? WHERE visit_id = ?', [currentTime, visit_id]);
            res.status(200).send('Check-in time updated successfully');
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
