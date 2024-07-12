// services/InternalColumnService.js
import { asyncHandler } from "../../../utils/asyncHandler.js";
import pool from "../../../database/db.js";
import { promisify } from "util";

const getConnection = promisify(pool.getConnection).bind(pool);
const executeQuery = promisify(pool.query).bind(pool);

const InternalColumnHeader = asyncHandler(async (req, res) => {
    try {
        const connection = await getConnection();

        const records = await executeQuery("SELECT Id, Name,Type FROM InternalColumns ORDER BY Id ASC");

        connection.release();

        if (!records || records.length === 0) {
            // If no records found, return an empty array
            return res.status(200).json([]);
        }

        // Extracting just the names from the records
        const recordsArray = records.map(record => ({ id: record.Id, name: record.Name ,type:record.Type}));

        res.status(200).json(recordsArray);
    } catch (error) {
        console.error("Error fetching records from database:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export { InternalColumnHeader };
