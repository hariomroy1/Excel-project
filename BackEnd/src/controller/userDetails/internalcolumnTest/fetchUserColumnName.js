import { asyncHandler } from "../../../utils/asyncHandler.js";
import pool from "../../../database/db.js";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import XLSX from "xlsx";

const getConnection = promisify(pool.getConnection).bind(pool);
const executeQuery = promisify(pool.query).bind(pool);

const fetchInternalColumnNames = asyncHandler(async (req, res) => {
  const { id: IngestionRecordId } = req.params; // Extract IngestionRecordId from URL params
  const { InternalColumnId } = req.query; // Extract InternalColumnId from query params

  try {
    const connection = await getConnection();

    const query = "SELECT UserColumn FROM MappingColumns WHERE IngestionRecordId = ? AND InternalColumnId = ? LIMIT 1";
    const params = [IngestionRecordId, InternalColumnId];
    
    const records = await executeQuery(query, params);
    connection.release();

    //******************   here i change error to response
    if (!records || records.length === 0) {
      return res.status(200).json({ userDetails: [] });
    }

    const userColumn = records[0].UserColumn;

    // Retrieve the fileUri using the IngestionRecordId
    const fileQuery = "SELECT FileUri FROM IngestionRecords WHERE id = ?";
    const fileParams = [IngestionRecordId];
    const fileRecords = await executeQuery(fileQuery, fileParams);
    
    if (!fileRecords || fileRecords.length === 0) {
      return res.status(404).json({ message: "Ingestion record not found" });
    }

    const fileUri = fileRecords[0].FileUri;

    // Construct the absolute file path
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

    // Find the index of the userColumn in headers
    const columnIndex = headers.indexOf(userColumn);
    if (columnIndex === -1) {
      return res.status(404).json({ message: "UserColumn not found in the Excel file" });
    }

    // Extract user details from the specified column
    const userDetails = data.slice(1).map(row => row[columnIndex]);

    res.status(200).json({ userDetails });
  } catch (error) {
    console.error("Error fetching user details from Excel file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { fetchInternalColumnNames };
