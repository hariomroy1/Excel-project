import { asyncHandler } from '../../../utils/asyncHandler.js';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import pool from '../../../database/db.js'; // Adjust the path according to your project structure

const updateUserDetails = asyncHandler(async (req, res) => {
    try {
        const data = req.body;

        // Generate a unique filename
        const timestamp = new Date().toISOString().replace(/[-T:]/g, "").slice(0, -5); // Example: 20220524T120000
        const filename = `data_${timestamp}.xlsx`; // Example: data_20220524T120000.xlsx

        // Path where the Excel file will be saved
        const filePath = `C:\\Users\\hariomroy\\Desktop\\Project\\BackEnd\\public\\upload\\${filename}`;

        // Extract column names from the first row of the sheet
        const sheet = XLSX.utils.json_to_sheet(data);
        const columnNames = Object.keys(sheet).filter(key => /^[A-Z]+1$/.test(key)).map(key => sheet[key].v);

        // Convert the JSON data to sheet format
        const dataToWrite = [columnNames, ...data.map(row => columnNames.map(header => row[header]))];
        const sheetData = XLSX.utils.aoa_to_sheet(dataToWrite);

        // Write the sheet to the Excel file
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheetData, "Sheet1");
        XLSX.writeFile(workbook, filePath);

        // Update the status in the IngestionRecords table to 'SUBMITTED'
        const ingestionId = req.params.id; // Assuming you are passing the ingestion ID as a URL parameter
        console.log("ingestionId: ", ingestionId);
        const updateStatusQuery = "UPDATE IngestionRecords SET Status = 'SUBMITTED' WHERE id = ?";
        await pool.query(updateStatusQuery, [ingestionId]);

        res.status(200).json({ message: "Data saved to Excel file successfully", filename });
    } catch (error) {
        console.error("Error saving data to Excel file:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export { updateUserDetails };
