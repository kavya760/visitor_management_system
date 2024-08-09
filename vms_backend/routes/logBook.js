router.put('/checkin_time/:id', async (req, res) => {
    const { id } = req.params;
    const { checkin_time } = req.body;

    const selectQuery = 'SELECT * FROM visits WHERE visit_id = ?';
    try {
        const [rows] = await req.db.query(selectQuery, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        await req.db.query('UPDATE visits SET checkin_time = ? WHERE visit_id = ?', [checkin_time, id]);
        res.status(200).send('Check-in time updated successfully');
    } catch (error) {
        console.error('Error updating check-in time:', error);
        res.status(500).send('Server error');
    }
});
