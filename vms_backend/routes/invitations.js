const express = require('express');
const router = express.Router();

// Update visit status
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log(status);

    const selectQuery = 'SELECT * FROM visits WHERE visit_id = ?';
    try {
        const [rows] = await req.db.query(selectQuery, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        const updateQuery = 'UPDATE visits SET status = ? WHERE visit_id = ?';
        const [updateResult] = await req.db.query(updateQuery, [status, id]);
        console.log("updating result:", updateResult);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ error: 'Visit not found' });
        }
         
        if (status === 'approved') {
            console.log(`Visit ${id} approved`);
        } else if (status === 'rejected') {
            console.log(`Visit ${id} rejected`);
        }

        res.json({ message: 'Status updated successfully' });

    } catch (err) {
        console.error('Error updating visit status:', err);
        res.status(500).json({ error: 'Failed to update visit status' });
    }
});

router.get('/visits', async (req, res) => {
    const { role_id, email } = req.user;

    let query = 'SELECT * FROM visits';
    const queryParams = [];

    if (role_id === 2) { 
        query += ' WHERE assigned_staff_email = ?';
        queryParams.push(email);
    }

    try {
        const [rows] = await req.db.query(query, queryParams);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching visits:', error);
        res.status(500).json({ error: 'Failed to fetch visits' });
    }
});

module.exports = router;
