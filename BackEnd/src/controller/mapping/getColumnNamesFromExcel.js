import { asyncHandler } from "../../utils/asyncHandler.js";
import pool from '../../database/db.js';
import { promisify } from 'util';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

const getConnection = promisify(pool.getConnection).bind(pool);
const executeQuery = promisify(pool.query).bind(pool);

// Function to fetch column names from an Excel sheet
const fetchColumnNamesFromExcel = async (filePath) => {
  try {
    // Read the Excel file
    //console.log("File path in FetchColumnExcel: ",filePath)
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    const sheet = workbook.Sheets[sheetName];

    // Extract column names from the first row of the sheet
    const columnNames = [];
    const range = xlsx.utils.decode_range(sheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = sheet[xlsx.utils.encode_cell({ r: range.s.r, c: C })];
      columnNames.push(cell ? cell.v : '');
    }
   // console.log("Column Names are: ",columnNames)
    return columnNames;
  } catch (error) {
    throw error;
  }
};

// Controller function to fetch column names from Excel based on ingestion record ID
const getColumnNamesFromIngestionRecordId = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; 

    // Query the database to get the FileUri of the ingestion record with the specified ID
    const record = await executeQuery('SELECT FileUri FROM IngestionRecords WHERE Id = ?', [id]);
     
   // console.log("file paths are:: ",record)
    // Check if the record exists
    if (!record) {
      return res.status(404).json({ message: "Ingestion record not found" });
    }

    const rootPath = 'C:/Users/hariomroy/Desktop/Project/BackEnd/';

    const absoluteFilePath = path.join(rootPath, record[0].FileUri);
   // console.log("absolute paths are: ",absoluteFilePath)


   // console.log("absolute paths are: ",absoluteFilePath)
    // Check if file exists
    if (!fs.existsSync(absoluteFilePath)) {
      return res.status(404).json({ message: "File not found at the specified path" });
    }
    //console.log("welcome")
    // Fetch column names from Excel using the file path
    const columnNames = await fetchColumnNamesFromExcel(absoluteFilePath);

    // Send column names to the frontend
    res.status(200).json({ columnNames });
  } catch (error) {
    console.error("Error fetching column names from Excel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { getColumnNamesFromIngestionRecordId };
