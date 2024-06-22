// controllers/userController.js
import { Router } from 'express';
import User from "../models/User.model.js"
import generateUniqueKey from '../utils/generateUniqueKey.js';
import { isEmpty } from '../utils/helperFunction.js';
const router = Router();


// POST /api/users - Create a new user
router.post('/', generateUniqueKey, async (req, res) => {
     try {
          const { name, profilePhoto, phone, idType, idNumber, employeType } = req.body;
          const newUser = new User({
               name: name?.trim()?.toLocaleLowerCase(),
               profilePhoto: isEmpty(profilePhoto) ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" : profilePhoto,
               phone,
               memberId: req?.generatedKey?.trim()?.toLocaleUpperCase(),
               govermentId: {
                    idType,
                    idNumber
               },
               employeType
          });
          const savedUser = await newUser.save();
          res.status(201).json(savedUser);
     } catch (error) {
          res.status(400).json({ error: error.message });
     }
});

router.get('/', async (req, res) => {
     try {
          let users;
          let { search: filter } = req.query; // Extract 'search' query parameter
          
          if (isEmpty(filter)) {
               users = await User.find();
          } else {
               // Perform search based on 'name' field using case-insensitive regex
               // users = await User.find({ name: { $regex: search, $options: 'i' } });

               // Check if filter is exactly 6 alphanumeric uppercase characters
               if (/^\d{10}$/.test(filter)) {
                    users = await User.find({ phone: filter });
               }
               // Otherwise, use regex to match name substring (case-insensitive)
               else {
                    filter = filter?.trim()?.toLocaleUpperCase()
                    users = await User.find({
                         $or: [
                              { name: { $regex: filter, $options: 'i' } },
                              { memberId: { $regex: filter, $options: 'i' } }
                         ]
                    });
               }

               if (isEmpty(users)) {
                    return res.status(404).json({ message: 'User not found' });
               }
          }

          if (!users || users.length === 0) {
               return res.status(404).json({ message: 'No users found' });
          }

          res.json(users);
     } catch (error) {
          console.error('Error fetching users:', error);
          res.status(500).json({ error: 'Internal server error' });
     }
});

// PUT /api/users/:id - Update a user by ID
router.put('/:id', async (req, res) => {
     try {
          const memberId = req.params.id

          const { name, profilePhoto, phone, idType, idNumber, employeType } = req.body;
          const updatedUser = await User.updateOne(
               { memberId },
               { name, profilePhoto, phone, govermentId: { idType, idNumber }, employeType },
               { new: true }
          );
          if (isEmpty(updatedUser)) {
               return res.status(404).json({ message: 'User not found' });
          }
          res.json(updatedUser);
     } catch (error) {
          console.error("Error updating the customer ",error);
          res.status(400).json({ error: error.message });
     }
});

// DELETE /api/users/:id - Delete a user by ID
router.delete('/:id', async (req, res) => {
     try {
          const deletedUser = await User.findByIdAndDelete(req.params.id);
          if (!deletedUser) {
               return res.status(404).json({ message: 'User not found' });
          }
          res.json({ message: 'User deleted successfully' });
     } catch (error) {
          res.status(500).json({ error: error.message });
     }
});

export default router;
