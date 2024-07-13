import { asyncHandler } from '../../../utils/asyncHandler.js';
import pool from '../../../database/db.js'; 
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

// Function to edit user details
const editUserDetails = asyncHandler(async (req, res) => {
  try {
    // Retrieve user details from request body
    const { userId, updatedDetails } = req.body;

    // Retrieve the existing user details from local storage
    const userDetailsPath = path.join(__dirname, 'userDetails.json');
    const userDetails = JSON.parse(fs.readFileSync(userDetailsPath, 'utf8'));

    // Find the user details to edit
    const userIndex = userDetails.findIndex(user => user.id === userId);

    // If the user is not found, return error
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user details
    userDetails[userIndex] = { ...userDetails[userIndex], ...updatedDetails };

    // Save the updated user details back to local storage
    fs.writeFileSync(userDetailsPath, JSON.stringify(userDetails));

    // Respond with the updated user details
    res.status(200).json({ message: 'User details updated successfully', userDetails: userDetails[userIndex] });
  } catch (error) {
    console.error('Error editing user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { editUserDetails };
