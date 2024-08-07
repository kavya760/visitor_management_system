const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const users = require('./routes/users');

const app = express();
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "vms_management"
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use('/api/users', (req, res, next) => {
    req.db = db; 
    next();
}, users);

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

// app.get('/api/visits', async (req, res) => {
//     const query = `
//         SELECT v.visit_date_time, v.purpose, v.status, 
//                u.first_name as visitor_first_name, u.last_name as visitor_last_name,
//                h.first_name as host_first_name, h.last_name as host_last_name,
//                l.location_name, vt.visit_type
//         FROM visits v
//         INNER JOIN users u ON v.visitor_id = u.user_id
//         INNER JOIN users h ON v.host_id = h.user_id
//         INNER JOIN locations l ON v.location_id = l.location_id
//         INNER JOIN visittypes vt ON v.visit_type_id = vt.visit_type_id
//     `;
//     try {
//         const [results] = await req.db.query('SELECT * FROM visits');
//         res.json(results);
//     } catch (err) {
//         console.error("Error fetching visits:", err);
//         res.status(500).json({ error: "Failed to fetch visits" });
//     }
// });

app.get('/api/visits', async (req, res) => {
    const query = `
        SELECT 
            v.visit_date, 
            v.visit_time,
            v.purpose, 
            v.status, 
            v.visit_id,
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
            visit_date: row.visit_date,
            visit_time: row.visit_time,
            purpose: row.purpose,
            status: row.status,
            visit_id: row.visit_id,
            location_name: row.location_name,
            visit_type: row.visit_type,
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
