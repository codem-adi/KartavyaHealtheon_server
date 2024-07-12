import dotenv from "dotenv"
import express from 'express';
import cors from "cors"
dotenv.config();
import mongoose from "mongoose"
import axios from 'axios';
import bodyParser from 'body-parser';

import userController from './controllers/userController.js';


// Create an Express application
const app = express();
// app.use(express.json())
app.use(express.json({ limit: '50mb' })); // Increase limit to 50MB
app.use(bodyParser.json());

console.log("process.env.WHITE_LIST_URLS ", process.env.WHITE_LIST_URLS?.split(","));

const corsOptions = {
     // origin: process.env.WHITE_LIST_URLS?.split(","),
     origin: process.env.WHITE_LIST_URL,
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

const macleods = 'https://macleods.healthflixcare.com/Login/mr_login';
const admin = 'https://kartavya.healtheonbooking.com/MR/index/';


async function login(email, password, whichWebsite, index) {
     const formData = new URLSearchParams();
     formData.append('email', email);
     formData.append('password', password);
     formData.append('submit', '');

     try {
          let response;
          if (whichWebsite === "macleods") {
               response = await axios.post(macleods, formData.toString(), {
                    headers: {
                         'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                         'accept-language': 'en-US,en;q=0.9',
                         'cache-control': 'max-age=0',
                         'content-type': 'application/x-www-form-urlencoded',
                         'priority': 'u=0, i',
                         'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                         'sec-ch-ua-mobile': '?0',
                         'sec-ch-ua-platform': '"Windows"',
                         'sec-fetch-dest': 'document',
                         'sec-fetch-mode': 'navigate',
                         'sec-fetch-site': 'same-origin',
                         'sec-fetch-user': '?1',
                         'upgrade-insecure-requests': '1',
                         'cookie': 'ci_session=5dc26jvu897ng166330anbd6ustdsdm8',
                         'Referer': macleods,
                         'Referrer-Policy': 'strict-origin-when-cross-origin',
                    },
               });
          } else if (whichWebsite === "admin") {
               response = await axios.post(admin, formData.toString(), {
                    headers: {
                         "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                         "accept-language": "en-US,en;q=0.9",
                         "cache-control": "max-age=0",
                         "content-type": "application/x-www-form-urlencoded",
                         "priority": "u=0, i",
                         "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                         "sec-ch-ua-mobile": "?0",
                         "sec-ch-ua-platform": "\"Windows\"",
                         "sec-fetch-dest": "document",
                         "sec-fetch-mode": "navigate",
                         "sec-fetch-site": "same-origin",
                         "sec-fetch-user": "?1",
                         "upgrade-insecure-requests": "1",
                         "cookie": "ci_session=5b731ea9bdad9a0710d10e0d597088ced5670a32; twk_idm_key=kQvuV3ABeV8LhweYPDr1E; TawkConnectionTime=0",
                         "Referer": "https://kartavya.healtheonbooking.com/MR/index",
                         "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    method: "POST"
               });
          } else {
               console.log("Not a valid whichWebsite provided");
               return false;
          }

          // Check if the response is a redirect
          if (response.request.res.responseUrl === "https://macleods.healthflixcare.com/Mr/check_camp" || response.request.res.responseUrl === "https://kartavya.healtheonbooking.com/MR/Dashboard") {
               console.log(index, "Login successful on ", whichWebsite);
               return true; // Login successful
          } else {
               console.log(index, "Login failed on ", whichWebsite);
               return false; // Login failed
          }
     } catch (error) {
          console.error('Error logging in:', error);
          return false; // Login failed due to error
     }
}

async function processSheet1(sheetData) {
     const results = [];
     const { Sheet1, whichWebsite } = sheetData
     console.log("sheetData ", Sheet1.length);
     console.log("sheetData ", whichWebsite);

     for (let index = 0; index < Sheet1.length; index++) {
          const data = Sheet1[index];
          const { Email, Password } = data;
          const loginResult = await login(Email, Password, whichWebsite);
          results.push({ Email, Password, LoginResult: loginResult, index });
     }
     return results;
}

app.post('/process-sheet', async (req, res) => {
     const sheetData = req.body;
     try {
          if (!sheetData?.whichWebsite) {
               return res.status(404).json({ success: false, message: "No right whichWebsite was provided." });
          }
          if (!sheetData?.Sheet1.length) {
               return res.status(404).json({ success: false, message: "Sheet have no data in it." });
          }
          const results = await processSheet1(sheetData);
          return res.json(results);

     } catch (error) {
          console.error('Error processing sheet:', error);
          return res.status(500).json({ success: false, error: 'Error processing sheet' });
     }
});

// Start the server
app.listen(PORT, async () => {
     // Connect to MongoDB using Mongoose
     // console.log("DB_URL ", process.env.DB_URL);
     await mongoose.connect(process.env.DB_URL);
     console.log(`Server is running on port ${PORT}`);
});

// https://kartavyahealtheon-server.onrender.com/process-sheet