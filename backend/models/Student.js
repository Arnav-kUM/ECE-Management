const mongoose = require('mongoose');

// Define the student schema
const studentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure unique email addresses
  },
  fullName: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true, // Ensure unique roll numbers
  },
  enrollmentDate: {
    type: Date, // Date when the student is enrolled
    default: Date.now, // Set a default value to the current date and time
    required: true,
  },
  contactNumber: {
    type: String,
  },
});

// Create the student model
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;