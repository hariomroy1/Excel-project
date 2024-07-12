import pool from "../../database/db.js";
import { promisify } from "util";
import { asyncHandler } from "../../utils/asyncHandler.js";

const executeQuery = promisify(pool.query).bind(pool);

const fetchColumnData = async () => {
  try {
    const query =
      "SELECT IngestionRecordId, UserColumn, InternalColumnId, InternalColumnType FROM MappingColumns;";
    const results = await executeQuery(query);
    return results.map((row) => ({
      IngestionId: row.IngestionRecordId,
      usercolumn: row.UserColumn,
      internalColumnId: row.InternalColumnId,
      internalcolumnType: row.InternalColumnType,
    }));
  } catch (error) {
    console.error("Error fetching column data from database:", error);
    throw error;
  }
};

const getMappingColumnData = asyncHandler(async (req, res) => {
  try {
    const columnData = await fetchColumnData();
    res.status(200).json(columnData);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
const fetchMappingColumnRecord = asyncHandler(async (req, res) => {
  try {
    // Extract the ingestion ID from the request parameters
    const { id } = req.params;

    // Construct the SQL query to fetch mapping records for the given ingestion ID
    const query = `SELECT IngestionRecordId, UserColumn, InternalColumnId, InternalColumnType 
                   FROM MappingColumns
                   WHERE IngestionRecordId = ?;`;

    // Execute the query with the ingestion ID parameter
    const results = await executeQuery(query, [id]);

    // Format the retrieved data
    const formattedData = results.map((row) => ({
      IngestionId: row.IngestionRecordId,
      usercolumn: row.UserColumn,
      internalcolumn: {
        id: row.InternalColumnId,
        type: row.InternalColumnType,
      },
    }));

    // Send the formatted data as a response
    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching mapping column record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export { getMappingColumnData, fetchMappingColumnRecord };
