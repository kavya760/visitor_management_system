const express = require('express');
const mysql = require('mysql');
const cors = require('cors');


const app = express();
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "vms_management"
});

db.connect((error) => {
    if (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    } else {
        console.log("MySQL Connected");
    }
});
app.use(cors());
app.use(express.json()); 

app.get('/api/locations', (req, res) => {
    const query = 'SELECT * FROM locations'; 
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });


//   app.get('/api/hosts', (req, res) => {
//     const query = 'SELECT * FROM hosts'; 
//     db.query(query, (err, results) => {
//       if (err) throw err;
//       res.json(results);
//     });
//   });

app.get('/api/visittypes', (req, res) => {
    const query = 'SELECT * FROM visittypes'; 
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  
// app.use('/api/logbook', logbookRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/invitation', invitationRoutes);
// app.use('/api/dashboard', dashboardRoutes);


app.listen(5000, (error) => {
    if (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    } else {
        console.log("Server starting on port 5000.");
    }
});
