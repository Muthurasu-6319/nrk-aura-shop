import mysql from 'mysql2';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// TiDB / Vercel Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // Priority: .env value -> Fallback to 'nrk_aura' (TiDB name)
    database: process.env.DB_NAME || 'nrk_aura',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 4000,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 1, // Optimized for Serverless
    queueLimit: 0,
    connectTimeout: 20000,
    enableKeepAlive: true
});

export default pool.promise();
