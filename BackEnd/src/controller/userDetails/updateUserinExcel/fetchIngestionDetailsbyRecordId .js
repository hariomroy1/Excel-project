import { asyncHandler } from '../../../utils/asyncHandler.js';
import pool from '../../../database/db.js'; 
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const getConnection = promisify(pool.getConnection).bind(pool);
const executeQuery = promisify(pool.query).bind(pool);

// Function to fetch ingestion details by ID
const fetchIngestionDetailsById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; // ingestionId from the path parameter
        const { dataId } = req.query; // dataId from the query parameter

        const connection = await getConnection();

        const query = 'SELECT FileUri FROM IngestionRecords WHERE id = ?';
        const existingRecord = await executeQuery(query, [id]);
        if (!existingRecord.length) {
            connection.release();
            return res.status(404).json({ message: "Ingestion record not found" });
        }

        const fileUri = existingRecord[0].FileUri;
        connection.release();

        const absoluteFilePath = path.join('C:\\Users\\hariomroy\\Desktop\\Project\\BackEnd', fileUri);
        if (!fs.existsSync(absoluteFilePath)) {
            return res.status(404).json({ message: "File not found" });
        }

        // Read the Excel file
        const workbook = XLSX.readFile(absoluteFilePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert the sheet to JSON
        const options = {
            header: 1,
            defval: '', // Default value for empty cells
            blankrows: true, // include blank rows
        };
        const data = XLSX.utils.sheet_to_json(sheet, options);

        // If the header row is not included by default, extract the headers manually
        const headers = data[0];
        const rows = data.slice(1).map((row, index) => {
            let rowData = { id: index + 1 }; // Added 'id' field with the row index
            headers.forEach((header, index) => {
                rowData[header] = row[index];
            });
            return rowData;
        });

        // Fetch the specific row based on dataId
        const rowIndex = parseInt(dataId, 10);
        if (isNaN(rowIndex) || rowIndex < 0 || rowIndex >= rows.length) {
            return res.status(400).json({ message: "Invalid dataId" });
        }
        let row = rows[rowIndex];

        res.status(200).json({ data: row });
    } catch (error) {
        console.error("Error fetching details from Excel file:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Function to update ingestion details by ID
// const updateIngestionDetailsById = asyncHandler(async (req, res) => {
//     try {
//         const { id } = req.params; // ingestionId from the path parameter
//         const { dataId } = req.query; // dataId from the query parameter
//         const updateData = req.body; // Data to update in the request body

//         const connection = await getConnection();

//         const query = 'SELECT FileUri FROM IngestionRecords WHERE id = ?';
//         const existingRecord = await executeQuery(query, [id]);
//         if (!existingRecord.length) {
//             connection.release();
//             return res.status(404).json({ message: "Ingestion record not found" });
//         }

//         const fileUri = existingRecord[0].FileUri;
//         connection.release();

//         const absoluteFilePath = path.join('C:\\Users\\hariomroy\\Desktop\\Project\\BackEnd', fileUri);
//         if (!fs.existsSync(absoluteFilePath)) {
//             return res.status(404).json({ message: "File not found" });
//         }

//         // Read the Excel file
//         const workbook = XLSX.readFile(absoluteFilePath);
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];

//         // Convert the sheet to JSON
//         const options = {
//             header: 1,
//             defval: '', // Default value for empty cells
//             blankrows: true, // include blank rows
//         };
//         const data = XLSX.utils.sheet_to_json(sheet, options);

//         // If the header row is not included by default, extract the headers manually
//         const headers = data[0];
//         const rows = data.slice(1).map((row, index) => {
//             let rowData = { id: index + 1 }; // Added 'id' field with the row index
//             headers.forEach((header, index) => {
//                 rowData[header] = row[index];
//             });
//             return rowData;
//         });

//         // Fetch the specific row based on dataId
//         const rowIndex = parseInt(dataId, 10);
//         if (isNaN(rowIndex) || rowIndex < 0 || rowIndex >= rows.length) {
//             return res.status(400).json({ message: "Invalid dataId" });
//         }
//         let row = rows[rowIndex];

//         // Update the row with the new data
//         Object.keys(updateData).forEach(key => {
//             if (row.hasOwnProperty(key)) {
//                 row[key] = updateData[key];
//             }
//         });

//         // Convert updated rows back to sheet format
//         const updatedData = [headers].concat(rows.map(row => headers.map(header => row[header])));
//         const newSheet = XLSX.utils.aoa_to_sheet(updatedData);
//         workbook.Sheets[sheetName] = newSheet;

//         // Write the updated workbook back to the file
//         XLSX.writeFile(workbook, absoluteFilePath);

//         res.status(200).json({ message: "Record updated successfully" });
//     } catch (error) {
//         console.error("Error updating details in Excel file:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

// Function to update ingestion details by ID
// Function to update ingestion details by ID
const updateIngestionDetailsById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; // ingestionId from the path parameter
        const { dataId } = req.query; // dataId from the query parameter
        const updateData = req.body; // Array of objects containing the updated data

        const connection = await getConnection();

        const query = 'SELECT FileUri FROM IngestionRecords WHERE id = ?';
        const existingRecord = await executeQuery(query, [id]);
        if (!existingRecord.length) {
            connection.release();
            return res.status(404).json({ message: "Ingestion record not found" });
        }

        const fileUri = existingRecord[0].FileUri;
        connection.release();

        const absoluteFilePath = path.join('C:\\Users\\hariomroy\\Desktop\\Project\\BackEnd', fileUri);
        if (!fs.existsSync(absoluteFilePath)) {
            return res.status(404).json({ message: "File not found" });
        }

        // Read the Excel file
        const workbook = XLSX.readFile(absoluteFilePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert the sheet to JSON
        const options = {
            header: 1,
            defval: '', // Default value for empty cells
            blankrows: true, // include blank rows
        };
        const data = XLSX.utils.sheet_to_json(sheet, options);

        // If the header row is not included by default, extract the headers manually
        const headers = data[0];
        const rows = data.slice(1).map((row, index) => {
            let rowData = { id: index + 1 }; // Added 'id' field with the row index
            headers.forEach((header, index) => {
                rowData[header] = row[index];
            });
            return rowData;
        });

        // Update the rows based on the provided updateData array
        updateData.forEach(update => {
            const { id: updateId, ...updateFields } = update;
            const rowIndex = parseInt(updateId, 10) - 1; // Adjust index to match array index
            if (rowIndex >= 0 && rowIndex < rows.length) {
                const row = rows[rowIndex];
                Object.keys(updateFields).forEach(key => {
                    if (row.hasOwnProperty(key)) {
                        row[key] = updateFields[key];
                    }
                });
            }
        });

        // Convert updated rows back to sheet format
        const updatedData = [headers].concat(rows.map(row => headers.map(header => row[header])));
        const newSheet = XLSX.utils.aoa_to_sheet(updatedData);
        workbook.Sheets[sheetName] = newSheet;

        // Write the updated workbook back to the file
        XLSX.writeFile(workbook, absoluteFilePath);

        res.status(200).json({ message: "Records updated successfully" });
    } catch (error) {
        console.error("Error updating details in Excel file:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export { fetchIngestionDetailsById, updateIngestionDetailsById };


