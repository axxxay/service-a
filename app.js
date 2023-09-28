const express = require("express");
const cors = require('cors');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(cors());

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateUserDetails = (request, response, next) => {
    const {email, age, location, username} = request.body;

    if (!emailRegex.test(email) || (!email.endsWith("@gmail.com") && !email.endsWith("@outlook.com") && !email.endsWith("@hotmail.com") && !email.endsWith("@yahoo.com"))) {
        return response.status(400).json({ error: 'Invalid email format' });
    }
    
    if (age < 18 || age > 45) {
        return response.status(400).json({ error: 'Age must be between 18 and 45' });
    }
    next();
};

app.post("/user-details", validateUserDetails, async (request, response) => {

    const options = {
        method: "POST", 
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(request.body)
    }

    try {
        const service2Response = await fetch("https://micro-service-b.onrender.com/store-in-db", options)
        // const service2Response = await fetch("http://localhost:5000/store-in-db", options)
        if (!service2Response.ok) {
            throw new Error('Failed to store data in Service B');
        }
        const data = await service2Response.json()
        response.send(data)
    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).json({ error: 'Service B communication error' });
    }
});

app.listen(PORT, () => {
    console.log(`Service A is running on port ${PORT}`);
});