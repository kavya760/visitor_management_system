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
    const { first_name, last_name, email, role_id, phone_number } = req.body;
    const plainPassword = 'password@123';
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        const query = 'INSERT INTO users (first_name, last_name, email, role_id, password, phone_number) VALUES (?, ?, ?, ?, ?, ?)';
        
        req.db.query(query, [first_name, last_name, email, role_id, hashedPassword, phone_number], (err, results) => {
            if (err) {
                console.error("Error creating user:", err);
                return res.status(500).json({ message: "Error creating user" });
            }

            res.json(results);
        });
    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ message: "Error creating user" });
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
