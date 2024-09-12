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

//create
router.post('/create', async (req, res) => {
    const { first_name, last_name, email, phone_number, password, role_id } = req.body;

    if (!first_name || !last_name || !email || !role_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = `
            INSERT INTO users (first_name, last_name, email, phone_number, password, role_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [first_name, last_name, email, phone_number, hashedPassword, role_id];
        const [results] = await req.db.query(query, params);
        res.status(201).json({ message: 'User created successfully', userId: results.insertId });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

//update
router.put('/update/:id', async (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, email, phone_number, password, role_id } = req.body;

    try {
        const hashedPassword = password ? await bcrypt.hash(password, saltRounds) : null;
        const query = `
            UPDATE users 
            SET 
                first_name = ?, 
                last_name = ?, 
                email = ?, 
                phone_number = ?, 
                role_id = ? 
                ${password ? ', password = ?' : ''} 
            WHERE user_id = ?
        `;
        
        const params = [
            first_name, 
            last_name, 
            email, 
            phone_number, 
            role_id, 
            ...(password ? [hashedPassword] : []), 
            userId
        ];

        const [results] = await req.db.query(query, params);

        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json({ message: 'User updated successfully' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user
router.delete('/delete/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const query = 'DELETE FROM users WHERE user_id = ?';
        const [results] = await req.db.query(query, [userId]);

        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json({ message: 'User deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
