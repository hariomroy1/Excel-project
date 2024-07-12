// Import necessary modules
import { asyncHandler } from "../../utils/asyncHandler.js";
import pool from "../../database/db.js";
import { promisify } from "util";

const getConnection = promisify(pool.getConnection).bind(pool);
const executeQuery = promisify(pool.query).bind(pool);

// Controller function to fetch all ingestion records
const getAllIngestionRecords = asyncHandler(async (req, res) => {
  try {
    const connection = await getConnection();

    const records = await executeQuery("SELECT * FROM IngestionRecords");

    if (!records || records.length === 0) {
      // If no records found, send a custom message
      return res.status(404).json({ message: "No ingestion records found" });
    }

    connection.release();

    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching records from database:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { getAllIngestionRecords };
