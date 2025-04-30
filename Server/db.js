const mysql = require('mysql2/promise'); // لازم تكون promise-based

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // غيره حسب بياناتك
  password: 'yahia2002',
  database: 'ExpenceTracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// اختبار الاتصال
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
})();

module.exports = pool; // لا تستخدم .promise() هنا
