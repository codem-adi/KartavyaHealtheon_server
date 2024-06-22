import dotenv from "dotenv"
import express from 'express';
import cors from "cors"
dotenv.config();
import mongoose from "mongoose"

import userController from './controllers/userController.js';


// Create an Express application
const app = express();
app.use(express.json())

// console.log("process.env.WHITE_LIST_URLS ", process.env.WHITE_LIST_URLS?.split(","));
const corsOptions = {
     origin: process.env.WHITE_LIST_URLS?.split(","),
     methods: ['GET', 'POST', "PUT"],
     allowedHeaders: ['Content-Type'],
     optionsSuccessStatus: 200
};

app.use(cors(corsOptions))

app.get('/', (req, res) => {
     res.send('Hello, Server is running.');
});

app.use('/api/users', userController);

// Define port number    
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, async () => {
     // Connect to MongoDB using Mongoose
     // console.log("DB_URL ",process.env.DB_URL);
     await mongoose.connect(process.env.DB_URL);
     console.log(`Server is running on port ${PORT}`);
});