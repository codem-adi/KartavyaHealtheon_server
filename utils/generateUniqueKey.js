import User from '../models/User.model.js'; // Replace with your User model

const generateUniqueKey = async (req, res, next) => {
     try {
          let key = generateRandomKey();

          // Check if the key already exists in the database
          let user = await User.findOne({ key });
          while (user) {
               key = generateRandomKey(); // Regenerate key if it already exists
               user = await User.findOne({ key });
          }

          req.generatedKey = key; // Attach the generated key to the request object
          next();
     } catch (error) {
          res.status(500).json({ error: error.message });
     }
};

const generateRandomKey = () => {
     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
     let key = '';
     for (let i = 0; i < 6; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          key += characters[randomIndex];
     }
     return key;
};

export default generateUniqueKey;
