import { upload } from "../../services/multer.services.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import pool from '../../database/db.js';
import { promisify } from 'util';
import xlsx from "xlsx";

const getConnection = promisify(pool.getConnection).bind(pool);
const executeQuery = promisify(pool.query).bind(pool);

// Controller function to handle the upload
const uploadExcelFile = asyncHandler(async (req, res) => {
  console.log("hariom");
  const { username } = req.body;
    console.log("username will be: ", username)
  const excelFile = req.file;

  try {
    const connection = await getConnection();

    // Insert record into the database
    const result = await executeQuery(
      'INSERT INTO IngestionRecords (UserName, FileName, FileUri, Status) VALUES (?, ?, ?, ?)',
      [username, excelFile.originalname, `/public/temp/${excelFile.filename}`, 'STORED_IN_TEMP_FOLDER']
    );

    // Extracting column names from the Excel file
const workbook = xlsx.readFile(req.file.path);

const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Assuming data is in the first sheet
//console.log(sheet)
const columnNames = Object.keys(sheet).filter(key => /^[A-Z]+$/.test(key)); // Assuming column names are in the first row
console.log(columnNames)
const columnsValues = columnNames.map(key => sheet[key].v);

// // Storing column names and default type in the database
// const columnsQuery = 'INSERT INTO InternalColumns (Name, Type) VALUES (?, ?)';
// const type = 'Custom'; // Set the default type as 'Custom'

// // Execute the query for each column name
// const values = columnsValues.map(name => [name, type]);
// await executeQuery(columnsQuery, [values]);
     
    connection.release();

    res.status(200).json({ message: "Excel file uploaded successfully", username });
  } catch (error) {
    console.error("Error inserting record into database:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { uploadExcelFile };
