import mysql from 'mysql';

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Hariom@25",
  database: "todoProject",
  connectionLimit: 10
});



export default pool;
