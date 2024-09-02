// const moment = require('moment');

// const getVisits = async (db) => {
//     const query = `
//         SELECT 
//             v.visit_date, 
//             v.visit_time,
//             v.purpose, 
//             v.status, 
//             v.visit_id,
//             v.checkin_time,    
//             v.checkout_time, 
//             u1.user_id AS visitor_id, 
//             u1.first_name AS visitor_first_name, 
//             u1.last_name AS visitor_last_name, 
//             u1.email AS visitor_email,
//             h1.user_id AS host_id, 
//             h1.first_name AS host_first_name, 
//             h1.last_name AS host_last_name, 
//             h1.email AS host_email,
//             l.location_name, 
//             vt.visit_type
//         FROM 
//             visits v
//         INNER JOIN 
//             users u1 ON v.visitor_id = u1.user_id
//         INNER JOIN 
//             users h1 ON v.host_id = h1.user_id
//         INNER JOIN 
//             locations l ON v.location_id = l.location_id
//         INNER JOIN 
//             visittypes vt ON v.visit_type_id = vt.visit_type_id
//     `;
//     try {
//         const [results] = await db.query(query);
//         return results.map(row => ({
//             visit_date: moment(row.visit_date).format('YYYY-MM-DD'),
//             visit_time: moment(row.visit_time, 'HH:mm:ss').format('h:mm:ss A'),
//             purpose: row.purpose,
//             status: row.status,
//             visit_id: row.visit_id,
//             location_name: row.location_name,
//             visit_type: row.visit_type,
//             checkin_time: row.checkin_time,  
//             checkout_time: row.checkout_time,
//             visitor: {
//                 user_id: row.visitor_id,
//                 email: row.visitor_email,
//                 first_name: row.visitor_first_name,
//                 last_name: row.visitor_last_name,
//             },
//             host: {
//                 user_id: row.host_id,
//                 email: row.host_email,
//                 first_name: row.host_first_name,
//                 last_name: row.host_last_name,
//             }
//         }));
//     } catch (err) {
//         throw new Error("Failed to fetch visits");
//     }
// };

// module.exports = getVisits;


const moment = require('moment');

const getVisitById = async (db, visitId) => {
    if (!visitId) {
        throw new Error("Visit ID is required");
    }

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
            u1.email AS visitor_email,
            h1.user_id AS host_id, 
            h1.first_name AS host_first_name, 
            h1.last_name AS host_last_name, 
            h1.email AS host_email,
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
        WHERE 
            v.visit_id = ?
    `;

    try {
        const [results] = await db.query(query, [visitId]);

        if (results.length === 0) {
            throw new Error("Visit not found");
        }

        return results.map(row => ({
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
                email: row.visitor_email,
                first_name: row.visitor_first_name,
                last_name: row.visitor_last_name,
            },
            host: {
                user_id: row.host_id,
                email: row.host_email,
                first_name: row.host_first_name,
                last_name: row.host_last_name,
            }
        }))[0]; // Return the first (and only) result
    } catch (err) {
        console.error("Failed to fetch visit by ID:", err);
        throw new Error("Failed to fetch visit by ID");
    }
};

module.exports = getVisitById;

