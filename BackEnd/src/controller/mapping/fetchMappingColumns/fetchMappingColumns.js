import express from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import pool from '../../../database/db.js';
import { promisify } from 'util';

const router = express.Router();

const getConnection = promisify(pool.getConnection).bind(pool);
const executeQuery = promisify(pool.query).bind(pool);

const fetchMappingColumns = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await getConnection();

    const query = `
      SELECT mc.UserColumn, ic.Name, mc.InternalColumnType 
      FROM MappingColumns mc
      JOIN InternalColumns ic ON mc.InternalColumnId = ic.Id
      WHERE mc.IngestionRecordId = ?
    `;
    const mappingColumns = await executeQuery(query, [id]);

    connection.release();

    if (!mappingColumns.length) {
      return res.status(404).json({ message: "No mapping columns found for the given ingestion record ID" });
    }

    res.status(200).json({ data: mappingColumns });
  } catch (error) {
    console.error("Error fetching mapping columns:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { fetchMappingColumns }
