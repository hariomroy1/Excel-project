import { asyncHandler } from '../../../utils/asyncHandler.js';
import fs from 'fs';
import path from 'path';

const deleteUserFile = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        // Construct the file path based on the ID
        const filename = `data_${id}.xlsx`;
        const filePath = `C:\\Users\\hariomroy\\Desktop\\Project\\BackEnd\\public\\upload\\${filename}`;
        console.log(filePath)
        // Check if the file exists
        if (fs.existsSync(filePath)) {
            // Delete the file
            fs.unlinkSync(filePath);
            res.status(200).json({ message: "File deleted successfully" });
        } else {
            res.status(404).json({ message: "File not found" });
        }
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export { deleteUserFile };
