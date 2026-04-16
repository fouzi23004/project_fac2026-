require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function updateAdminPassword() {
  try {
    console.log('Generating password hash for "Admin@123"...');
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    console.log('Hash generated:', passwordHash);

    console.log('\nUpdating admin user password...');
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING email, role',
      [passwordHash, 'admin@university.edu']
    );

    if (result.rows.length > 0) {
      console.log('✅ Password updated successfully for:', result.rows[0].email);
      console.log('   Role:', result.rows[0].role);
      console.log('\nYou can now login with:');
      console.log('   Email: admin@university.edu');
      console.log('   Password: Admin@123');
    } else {
      console.log('❌ Admin user not found');
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateAdminPassword();
