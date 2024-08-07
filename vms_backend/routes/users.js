const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Get all users
router.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    req.db.query(query, (err, results) => { 
        if (err) {
            console.error("Error fetching users:", err);
            res.status(500).json({ message: "Error fetching users" });
            return;
        }
        res.json(results);
    });
});

router.post('/create', async (req, res) => {
    const { first_name, last_name, email, phone_number, visit_date, visit_time, host_id, location_id, purpose, visit_type_id } = req.body;
    console.log('Received create request with data:', req.body);
    const db = req.db;

    try {
        // Check if the visitor already exists
        const [userResults] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        let visitor = userResults[0];

        if (!visitor) {
            // Create new user if not exists
            const [roleResults] = await db.query('SELECT * FROM roles WHERE role_name = ?', ['user']);
            const userRole = roleResults[0];
            const defaultPassword = "password";
            const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

            const [createUserResults] = await db.query(
                'INSERT INTO users (first_name, last_name, email, phone_number, password, role_id) VALUES (?, ?, ?, ?, ?, ?)',
                [first_name, last_name, email, phone_number, hashedPassword, userRole ? userRole.role_id : null]
            );

            const [newUserResults] = await db.query('SELECT * FROM users WHERE user_id = ?', [createUserResults.insertId]);
            visitor = newUserResults[0];
        }

        // Create visit
        const [createVisitResults] = await db.query(
            'INSERT INTO visits (visit_date, visit_time, visitor_id, host_id, location_id, purpose, visit_type_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [visit_date, visit_time || null, visitor.user_id, host_id, location_id, purpose, visit_type_id, 'Pending']
        );

        const [visitResults] = await db.query('SELECT * FROM visits WHERE visit_id = ?', [createVisitResults.insertId]);
        const fullVisit = visitResults[0];

        if (!fullVisit) {
            return res.status(500).json({ error: "Failed to fetch visit details" });
        }

        const visitDetails = {
            ...fullVisit,
            visitor,
            host: fullVisit.host_id,
            visit_type: fullVisit.visit_type_id,
            location: fullVisit.location_id,
            visit_date: fullVisit.visit_date,
            visit_time: fullVisit.visit_time,
            checkin_time: null,
            checkout_time: null,
            confirmation_id: null
        };

        res.status(201).json({ message: "Visit created successfully", visit: visitDetails });

    } catch (error) {
        console.error("Error creating or processing visit:", error);
        res.status(500).json({ error: "Failed to create visit", details: error.message });
    }
});

// Update user
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate the status
    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    const updateQuery = 'UPDATE visits SET status = ? WHERE visit_id = ?';
    
    try {
        const [updateResult] = await req.db.query(updateQuery, [status, id]);
        
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ error: 'Visit not found' });
        }
        const selectQuery = 'SELECT * FROM visits WHERE visit_id = ?';
        const [visitResult] = await req.db.query(selectQuery, [id]);

        if (visitResult.length === 0) {
            return res.status(404).json({ error: 'Visit not found after update' });
        }

        const visit = visitResult[0];
        if (status === 'approved') {
            // Add your logic for approved status here, e.g., sending a confirmation email
            console.log('Visit approved:', visit);
        } else if (status === 'rejected') {
            // Add your logic for rejected status here, e.g., notifying rejection
            console.log('Visit rejected:', visit);
        }

        res.json({ message: 'Status updated successfully', visit });
    } catch (err) {
        console.error("Error updating visit status:", err);
        res.status(500).json({ error: 'Failed to update visit status' });
    }
});
//     const { first_name, last_name, email, role_id, password, phone_number } = req.body;
//     let hashedPassword = password; 

//     try {
//         if (password) {
//             hashedPassword = await bcrypt.hash(password, saltRounds);
//         }

//         const query = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, role_id = ?, password = ?, phone_number = ? WHERE user_id = ?';
//         req.db.query(query, [first_name, last_name, email, role_id, hashedPassword, phone_number, req.params.id], (err, results) => { 
//             if (err) {
//                 console.error("Error updating user:", err);
//                 return res.status(500).json({ message: "Error updating user" });
//             }
//             if (results.affectedRows === 0) {
//                 return res.status(404).json({ message: "User not found" });
//             }
//             res.json(results);
//         });
//     } catch (error) {
//         console.error("Error hashing password:", error);
//         res.status(500).json({ message: "Error updating user" });
//     }
 


// Delete user
router.delete('/delete/:id', (req, res) => {
    const query = 'DELETE FROM users WHERE user_id = ?';
    req.db.query(query, [req.params.id], (err, results) => { 
        if (err) {
            console.error("Error deleting user:", err);
            res.status(500).json({ message: "Error deleting user" });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
