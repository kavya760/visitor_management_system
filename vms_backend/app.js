const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const session = require('express-session'); 
const users = require('./routes/users');
const invitations = require('./routes/invitations');
const logBook = require('./routes/logBook');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: 'your-secret-key', 
    resave: false,             
    saveUninitialized: false,  
    cookie: { secure: true }  
}));

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  }));

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "vms_management"
});

app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use('/api/users', users);
app.use('/api/visits', invitations);
app.use('/api/visits', logBook);

async function getUserByEmail(email) {
    try {
        const [results] = await db.query(`
            SELECT u.*, r.role_name
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.role_id
            WHERE u.email = ?`, [email]);
        return results.length > 0 ? results[0] : null;
    } catch (err) {
        throw new Error('Database query failed');
    }
}


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ first_name:user.first_name, role_name:user.role_name, email: user.email, user_id:user.user_id }, "our-jsonwebtoken-secret-key", { expiresIn: '1d' });
            res.status(200).json({
                status: "Success",
                message: 'Login successful',
                token:token,
                first_name: user.first_name,
            });
        } else {
            res.status(401).json({ status: "Error", Message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error processing login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/locations', async (req, res) => {
    try {
        const [results] = await req.db.query('SELECT * FROM locations');
        res.json(results);
    } catch (err) {
        console.error("Error fetching locations:", err);
        res.status(500).json({ error: "Failed to fetch locations" });
    }
});

app.get('/api/visittypes', async (req, res) => {
    try {
        const [results] = await req.db.query('SELECT * FROM visittypes');
        res.json(results);
    } catch (err) {
        console.error("Error fetching visit types:", err);
        res.status(500).json({ error: "Failed to fetch visit types" });
    }
});

app.get('/api/get_users', async (req, res) => {
    try {
        const [results] = await req.db.query('SELECT * FROM users');
        res.json(results);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

app.get('/api/visits', async (req, res) => {
    const query = `
        SELECT 
            v.visit_date, 
            v.visit_time,
            v.purpose, 
            v.status, 
            v.visit_id,
            v.checkin_time,    
            v.checkout_time, 
            u1.user_id AS visitor_id, 
            u1.first_name AS visitor_first_name, 
            u1.last_name AS visitor_last_name, 
            h1.user_id AS host_id, 
            h1.first_name AS host_first_name, 
            h1.last_name AS host_last_name, 
            l.location_name, 
            vt.visit_type
        FROM 
            visits v
        INNER JOIN 
            users u1 ON v.visitor_id = u1.user_id
        INNER JOIN 
            users h1 ON v.host_id = h1.user_id
        INNER JOIN 
            locations l ON v.location_id = l.location_id
        INNER JOIN 
            visittypes vt ON v.visit_type_id = vt.visit_type_id
    `;
    try {
        const [results] = await req.db.query(query);
        const transformedResults = results.map(row => ({
            visit_date: moment(row.visit_date).format('YYYY-MM-DD'),
            visit_time: moment(row.visit_time, 'HH:mm:ss').format('h:mm:ss A'),
            purpose: row.purpose,
            status: row.status,
            visit_id: row.visit_id,
            location_name: row.location_name,
            visit_type: row.visit_type,
            checkin_time: row.checkin_time,  
            checkout_time: row.checkout_time,
            visitor: {
                user_id: row.visitor_id,
                first_name: row.visitor_first_name,
                last_name: row.visitor_last_name,
            },
            host: {
                user_id: row.host_id,
                first_name: row.host_first_name,
                last_name: row.host_last_name,
            }
        }));

        res.json(transformedResults);
    } catch (err) {
        console.error("Error fetching visits:", err);
        res.status(500).json({ error: "Failed to fetch visits" });
    }
});




app.listen(5000, (error) => {
    if (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    } else {
        console.log("Server starting on port 5000.");
    }
});

module.exports = db;
