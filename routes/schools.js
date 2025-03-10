const express = require("express");
const router = express.Router();
const db = require("../db");

// Validation function
const validateSchoolData = (name, address, latitude, longitude) => {
    const errors = [];
    
    if (!name || typeof name !== 'string' || name.trim() === '') 
        errors.push("Name is required and must be a non-empty string");
    
    if (!address || typeof address !== 'string' || address.trim() === '') 
        errors.push("Address is required and must be a non-empty string");
    
    if (latitude === undefined || latitude === null) 
        errors.push("Latitude is required");
    else if (isNaN(parseFloat(latitude))) 
        errors.push("Latitude must be a valid number");
    else if (parseFloat(latitude) < -90 || parseFloat(latitude) > 90) 
        errors.push("Latitude must be between -90 and 90 degrees");
    
    if (longitude === undefined || longitude === null) 
        errors.push("Longitude is required");
    else if (isNaN(parseFloat(longitude))) 
        errors.push("Longitude must be a valid number");
    else if (parseFloat(longitude) < -180 || parseFloat(longitude) > 180) 
        errors.push("Longitude must be between -180 and 180 degrees");
    
    return errors.length > 0 ? errors.join(", ") : null;
};

// here i have written the logic to add school
router.post("/addSchool", async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;
        const error = validateSchoolData(name, address, latitude, longitude);
        
        if (error) {
            return res.status(400).json({ error });
        }

        // Convert to float to ensure proper data type
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        
        const [result] = await db.query(
            "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)", 
            [name, address, lat, lng]
        );
        
        res.status(201).json({ 
            message: "School added successfully",
            schoolId: result.insertId
        });
    } catch (err) {
        console.error("Error adding school:", err);
        res.status(500).json({ error: "Failed to add school. Please try again later." });
    }
});

/*

here i have used the haversine distance formula .basically ye formula se mein ye dekh skta huin ki
if i have (lat,long) of 2 points then how can i find the smallest distance bw them

*/
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// List schools sorted by distance
router.get("/listSchools", async (req, res) => {
    try {
        const { latitude, longitude } = req.query;
        
        if (!latitude || !longitude) {
            return res.status(400).json({ error: "Latitude and longitude are required query parameters" });
        }
        
        if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
            return res.status(400).json({ error: "Latitude and longitude must be valid numbers" });
        }
        
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        
        if (lat < -90 || lat > 90) {
            return res.status(400).json({ error: "Latitude must be between -90 and 90 degrees" });
        }
        
        if (lng < -180 || lng > 180) {
            return res.status(400).json({ error: "Longitude must be between -180 and 180 degrees" });
        }

        const [schools] = await db.query("SELECT * FROM schools");

        if (!schools.length) {
            return res.status(200).json([]);
        }

        const sortedSchools = schools.map(school => ({
            ...school,
            distance: haversineDistance(lat, lng, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        return res.status(200).json(sortedSchools);
    } catch (err) {
        console.error("Error listing schools:", err);
        return res.status(500).json({ error: "Failed to retrieve schools. Please try again later." });
    }
});

module.exports = router;
