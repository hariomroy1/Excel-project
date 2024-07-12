import { asyncHandler } from "../../../utils/asyncHandler.js";
import pool from "../../../database/db.js";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import XLSX from "xlsx";

const getConnection = promisify(pool.getConnection).bind(pool);
const executeQuery = promisify(pool.query).bind(pool);

const fetchIngestionDetails = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { page, itemsPerPage } = req.query; // Extract page and itemsPerPage from query parameters
    const pageNum = parseInt(page, 10) || 1; // Default to page 1 if not provided
    const itemsPerPageNum = parseInt(itemsPerPage, 10) || 5; // Default to 5 items per page if not provided
    const offset = (pageNum - 1) * itemsPerPageNum; // Calculate offset based on page number

    const connection = await getConnection();

    const query = "SELECT FileUri FROM IngestionRecords WHERE id = ?";
    const existingRecord = await executeQuery(query, [id]);
    if (!existingRecord.length) {
      connection.release();
      return res.status(404).json({ message: "Ingestion record not found" });
    }

    const fileUri = existingRecord[0].FileUri;
    connection.release();

    const absoluteFilePath = path.join(
      "C:\\Users\\hariomroy\\Desktop\\Project\\BackEnd",
      fileUri
    );
    if (!fs.existsSync(absoluteFilePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Read the Excel file
    const workbook = XLSX.readFile(absoluteFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
  

    // Convert the sheet to JSON
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    // Extract headers from the first row
    const headers = data[0];
  
    // Calculate the total number of rows (excluding the header row)
    const totalRows = data.length - 1;
    const totalPages = Math.ceil(totalRows / itemsPerPageNum);
    // Extract rows based on pagination
    const rows = data
      .slice(offset + 1, offset + 1 + itemsPerPageNum)
      .map((row, index) => {
        let rowData = { id: offset + index + 1 }; // Adjust 'id' to reflect global index
           
        console.log("Length:",headers.length)
        // Iterate through each header
        for (let i = 0; i < headers.length; i++) {
          const header = headers[i];
        
          // Assign the data to the corresponding header in the rowData object
          //rowData[header] = row[i];
          rowData[header] = row[i] !== undefined ? row[i] : '';
        }
        
        return rowData;
      });
      
    res.status(200).json({ data: rows, total: totalRows, totalPages });
  } catch (error) {
    console.error("Error fetching details from Excel file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { fetchIngestionDetails };
