import mongoose from 'mongoose';

const GoverMentID = new mongoose.Schema({
     idType: { type: String, enum: ["Aadhaar", "Pan", "DrivingLicence", "Passport"] },
     idNumber: { type: String, unique: true }
})

const userSchema = new mongoose.Schema({
     name: { type: String, required: true },
     profilePhoto: { type: String, required: true },
     phone: { type: String, required: true },
     memberId: { type: String, unique: true },
     govermentId: { type: GoverMentID },
     employeType: { type: String, enum: ["HealthWorker", "Trainer", "Physio"] }
}, { versionKey: 0 });

const User = mongoose.model('User', userSchema);

export default User;
