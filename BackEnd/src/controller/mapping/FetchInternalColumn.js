import pool from '../../database/db.js';
import { promisify } from 'util';
import { asyncHandler } from "../../utils/asyncHandler.js";

const executeQuery = promisify(pool.query).bind(pool);

// Function to fetch column names and descriptions from the InternalColumns table
const fetchColumnData = async () => {
  try {
    // Query to select column names and descriptions from the InternalColumns table
    const query = 'SELECT Id,Name, Description,Type FROM InternalColumns';
    
    // Execute the query
    const results = await executeQuery(query);

   // console.log("results are: ",results)

    // Extract column names and descriptions from the results
    const columnData = results.map(row => ({ id:row.Id,name: row.Name, description: row.Description,Type:row.Type }));

    return columnData;
  } catch (error) {
    console.error("Error fetching column data from database:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

// Controller function to fetch column names and descriptions and handle errors asynchronously
const getColumnData = asyncHandler(async (req, res) => {
  const columnData = await fetchColumnData();
  res.status(200).json(columnData);
});

export { getColumnData };
