const express = require('express');
const router = express.Router();
const sendEmail = require('../sendMail')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const generateEmailBody = require('../emailTemplate');
const getVisitById = require('../utilities/deserialize');
const generateEmailVisitor = require('../visitorEmailTemplate');

//create
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
            const roleId = userRole ? userRole.role_id : null;
            const defaultPassword = "password";
            const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

            const [createUserResults] = await db.query(
                'INSERT INTO users (first_name, last_name, email, phone_number, password, role_id) VALUES (?, ?, ?, ?, ?, ?)',
                [first_name, last_name, email, phone_number, hashedPassword, roleId]
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

        // const visitDetails = {
        //     ...fullVisit,
        //     visitor,
        //     host: fullVisit.host_id,
        //     visit_type: fullVisit.visit_type_id,
        //     location: fullVisit.location_id,
        //     visit_date: fullVisit.visit_date,
        //     visit_time: fullVisit.visit_time,
        //     checkin_time: null,
        //     checkout_time: null,
        //     confirmation_id: null
        // };
        
        const visit_serialized = await getVisitById(db, createVisitResults.insertId);
        const emailContent = generateEmailVisitor(visit_serialized);

        await sendEmail(visitor.email, 'Visit Scheduled ', emailContent);

        res.status(201).json({ 
            message: "Visit created successfully", 
            visit_id: visit_serialized.visit_id,
            visit: visit_serialized
        });

    } catch (error) {
        console.error("Error creating or processing visit:", error);
        res.status(500).json({ error: "Failed to create visit", details: error.message });
    }
});

//update
router.put('/update/:id', async (req, res) => {
    console.log('Update route handler started');
    const { id } = req.params;
    const { status } = req.body;    

    const selectQuery = 'SELECT * FROM visits WHERE visit_id = ?';
    try {
        const [rows] = await req.db.query(selectQuery, [id]);

        if (rows.length === 0) {
            console.log('No visit found with the given ID');
            return res.status(404).json({ error: 'Visit not found' });
        }

        const updateQuery = 'UPDATE visits SET status = ? WHERE visit_id = ?';
        const [updateResult] = await req.db.query(updateQuery, [status, id]);
        console.log("Updating result:", updateResult);

        if (updateResult.affectedRows === 0) {
            console.log('No rows updated');
            return res.status(404).json({ error: 'Visit not found' });
        }
        // await sendEmail("test@example.com", "Test Subject", "<p>This is a test email.</p>");

        const visit = rows[0];
        const visit_serialized= await getVisitById(req.db,id); 

        const emailSubject = status === 'approved'
            ? 'Your Visit has been Approved'
            : 'Your Visit has been Rejected';
            
        const emailBody = generateEmailBody(visit_serialized);
        console.log('Email Subject:', emailSubject);
        
        res.json({ message: 'Status updated successfully. Email will be sent shortly.' });
        try {
            console.log('Before sending email');
            const recipientEmail = "kavyargowda223@gmail.com"; 
            await sendEmail(recipientEmail, emailSubject, emailBody);
            console.log('After sending email');
            console.log('Email sent successfully');
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }
        

    } catch (err) {
        console.error('Error updating visit status:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to update visit status' });
        }
    }
});



module.exports = router;




