const express = require('express');
const router = express.Router();

router.put('/checkin_time/:id', async (req, res) => {
    const visit_id = req.params.id; 
    const checkin_time = new Date();

    const selectQuery = 'SELECT * FROM visits WHERE visit_id = ?';
    try {
        const [rows] = await req.db.query(selectQuery, [visit_id]); 
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        await req.db.query('UPDATE visits SET checkin_time = ? WHERE visit_id = ?', [checkin_time, visit_id]);
        res.status(200).send('Check-in time updated successfully');
    } catch (error) {
        console.error('Error updating check-in time:', error);
        res.status(500).send('Server error');
    }
});

router.put('/checkout_time/:id', async (req, res) => {
    const visit_id = req.params.id; 
    const checkout_time = new Date();

    const selectQuery = 'SELECT * FROM visits WHERE visit_id = ?';
    try {
        const [rows] = await req.db.query(selectQuery, [visit_id]); 
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        await req.db.query('UPDATE visits SET checkout_time = ? WHERE visit_id = ?', [checkout_time, visit_id]);
        res.status(200).send('Check-in time updated successfully');
    } catch (error) {
        console.error('Error updating check-out time:', error);
        res.status(500).send('Server error');
    }
});


module.exports = router;
