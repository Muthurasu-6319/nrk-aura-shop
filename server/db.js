import mysql from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from root (Going one folder up from 'server')
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log("------------------------------------------------");
console.log("🔌 DEBUGGING DATABASE CONNECTION");
console.log("------------------------------------------------");
console.log("📂 Looking for .env at:", envPath);
console.log("👤 DB User:", process.env.DB_USER || "UNDEFINED (Check .env file!)");
console.log("🏠 DB Host:", process.env.DB_HOST || "UNDEFINED (Check .env file!)");
console.log("📦 DB Name:", process.env.DB_NAME || "UNDEFINED");
console.log("------------------------------------------------");

// TiDB / Vercel Connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'nrk_aura_db',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 4000,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    },
    connectTimeout: 20000, // Wait 20 seconds before failing
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    enableKeepAlive: true
});

// Test connection
if (process.env.NODE_ENV !== 'production') {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('❌ Database Connection Failed!');
            console.error('⚠️ Error Code:', err.code);
            console.error('⚠️ Error Message:', err.message);

            if(err.code === 'HANDSHAKE_SSL_ERROR') {
                console.log("💡 Hint: TiDB requires SSL. Check if your Node version supports TLS 1.2");
            } else if (err.code === 'ETIMEDOUT') {
                console.log("💡 Hint: Check TiDB Cloud 'IP Access List'. Your IP might be blocked.");
            } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                console.log("💡 Hint: Wrong Password or User. Check .env file.");
            }
        } else {
            console.log('✅ Successfully connected to TiDB Database!');
            connection.release();
        }
    });
}

export default pool.promise();