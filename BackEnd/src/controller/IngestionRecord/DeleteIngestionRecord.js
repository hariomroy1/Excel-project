import { asyncHandler } from "../../utils/asyncHandler.js";
import pool from '../../database/db.js';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const getConnection = promisify(pool.getConnection).bind(pool);
const executeQuery = promisify(pool.query).bind(pool);



const deleteIngestionRecord = asyncHandler(async (req, res) => {
  try {
      const { id } = req.params; 

      const connection = await getConnection();

      const existingRecord = await executeQuery('SELECT * FROM IngestionRecords WHERE id = ?', [id]);
      if (!existingRecord.length) {
          connection.release();
          return res.status(404).json({ message: "Ingestion record not found" });
      }

      const fileUri = existingRecord[0].FileUri; 
      if (fileUri) {
          const filePath = path.join('C:\\Users\\hariomroy\\Desktop\\Project\\BackEnd', fileUri);
          console.log("file paths are: ",filePath)
          if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
          }
      }

      // Delete records from the MappingColumns table
      await executeQuery('DELETE FROM MappingColumns WHERE IngestionRecordId = ?', [id]);

      // Delete records from IngestionRecords table
      await executeQuery('DELETE FROM IngestionRecords WHERE id = ?', [id]);

      connection.release();

      res.status(200).json({ message: "Ingestion record and associated files deleted successfully" });
  } catch (error) {
      console.error("Error deleting record and associated files:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

  

export { deleteIngestionRecord };
