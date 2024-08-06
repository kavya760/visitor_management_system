const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const moment = require('moment');
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
    const { first_name, last_name, email, phone_number, visit_date_time, host_id, location_id, purpose, visit_type_id } = req.body;
    console.log('Received create request with data:', req.body);
    const db = req.db;

    try {
        const [userResults] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        let visitor = userResults[0];

        if (!visitor) {
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
        
        const [createVisitResults] = await db.query(
            'INSERT INTO visits (visit_date_time, visitor_id, host_id, location_id, purpose, visit_type_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [visit_date_time, visitor.user_id, host_id, location_id, purpose, visit_type_id, 'Pending']
        );

        const [visitResults] = await db.query('SELECT * FROM visits WHERE visit_id = ?', [createVisitResults.insertId]);
        const fullVisit = visitResults[0];

        if (!fullVisit) {
            return res.status(500).json({ error: "Failed to fetch visit details" });
        }

        const visitDetails = {
            ...fullVisit,
            visitor,
            host: fullVisit?.host_id,
            visit_type: fullVisit.visit_type_id,
            location: fullVisit.location_id,
            visitDateFormatted: moment(fullVisit.visit_date_time).format("DD-MM-YYYY"),
            visitTimeFormatted: moment(fullVisit.visit_date_time).format("hh:mm:ss A"),
            checkin_time: null,
            checkout_time: null,
            confirmation_id: null
        };

        res.status(201).json({ message: "Visit created successfully", visit: visitDetails });

        try {
            console.log("Confirmation email sent successfully");
        } catch (error) {
            console.error("Error sending confirmation email:", error);
        }
    } catch (error) {
        console.error("Error creating or processing visit:", error);
        res.status(500).json({ error: "Failed to create visit" });
    }
});

// Update user
router.put('/update/:id', async (req, res) => {
    const { first_name, last_name, email, role_id, password, phone_number } = req.body;
    let hashedPassword = password; 

    try {
        if (password) {
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        const query = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, role_id = ?, password = ?, phone_number = ? WHERE user_id = ?';
        req.db.query(query, [first_name, last_name, email, role_id, hashedPassword, phone_number, req.params.id], (err, results) => { 
            if (err) {
                console.error("Error updating user:", err);
                return res.status(500).json({ message: "Error updating user" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(results);
        });
    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ message: "Error updating user" });
    }
});

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
