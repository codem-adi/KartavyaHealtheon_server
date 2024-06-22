import dotenv from "dotenv"
import express from 'express';
import cors from "cors"
dotenv.config();
import mongoose from "mongoose"

import userController from './controllers/userController.js';


// Create an Express application
const app = express();
app.use(express.json())

const corsOptions = {
     origin: ['http://localhost:5173', 'http://192.168.0.106:5173'],
     methods: ['GET', 'POST', "PUT"],
     allowedHeaders: ['Content-Type'],
     optionsSuccessStatus: 200
};

app.use(cors(corsOptions))

app.get('/', (req, res) => {
     res.send('Hello, Server is running.');
});

// Define a route
app.get('/api/v1/users', (req, res) => {
     res.send('Hello, World!');
});

app.use('/api/users', userController);

// Define port number
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, async () => {
     // Connect to MongoDB using Mongoose
     await mongoose.connect(process.env.DB_URL);
     console.log(`Server is running on port ${PORT}`);
});