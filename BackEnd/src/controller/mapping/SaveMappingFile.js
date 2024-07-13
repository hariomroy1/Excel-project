import pool from "../../database/db.js";
import { promisify } from "util";
import { asyncHandler } from "../../utils/asyncHandler.js";

const executeQuery = promisify(pool.query).bind(pool);

// Controller function to save mapping columns and handle errors asynchronously
const SaveMappingFile = asyncHandler(async (req, res) => {
  try {
    const mappingDataArray = req.body || [];

    if (!Array.isArray(mappingDataArray) || mappingDataArray.length === 0) {
      return res.status(400).json({ error: "Invalid or empty request body" });
    }

    // Track ingestion IDs to process them uniquely
    const uniqueIngestionIds = new Set();

    // Validate and collect unique IngestionIds
    for (const mappingData of mappingDataArray) {
      const { IngestionId, usercolumn, internalcolumn } = mappingData;

      // Validate required fields
      if (!IngestionId || !usercolumn || !internalcolumn || !internalcolumn.id || !internalcolumn.type) {
        console.error("Required fields are missing in the request body:", mappingData);
        continue; // Skip current iteration and move to the next one
      }

      uniqueIngestionIds.add(IngestionId);
    }

    // Delete existing records for each unique IngestionId
    for (const IngestionId of uniqueIngestionIds) {
      const deleteMappingsQuery = "DELETE FROM MappingColumns WHERE IngestionRecordId = ?";
      await executeQuery(deleteMappingsQuery, [IngestionId]);
    }

    // Insert new mappings for each mapping data
    for (const mappingData of mappingDataArray) {
      const { IngestionId, usercolumn, internalcolumn } = mappingData;
      const { id: InternalColumnId, type: InternalColumnType } = internalcolumn;

      // Validate required fields
      if (!IngestionId || !usercolumn || !InternalColumnId || !InternalColumnType) {
        console.error("Required fields are missing in the request body:", mappingData);
        continue;
      }

      const insertQuery = `
        INSERT INTO MappingColumns (IngestionRecordId, UserColumn, InternalColumnId, InternalColumnType)
        VALUES (?, ?, ?, ?)`;

      await executeQuery(insertQuery, [
        IngestionId,
        usercolumn,
        InternalColumnId,
        InternalColumnType,
      ]);
    }

    // Insert or update IngestionRecords
    const insertIngestionQuery = `
      INSERT INTO IngestionRecords (id, Status) VALUES (?, 'MAPPING_DONE')
      ON DUPLICATE KEY UPDATE Status = 'MAPPING_DONE'`;

    for (const IngestionId of uniqueIngestionIds) {
      await executeQuery(insertIngestionQuery, [IngestionId]);
    }

    res.status(201).json({ message: "Mapping columns saved successfully and status updated to 'MAPPING_DONE'" });
  } catch (error) {
    console.error("Error saving mapping columns:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { SaveMappingFile };






