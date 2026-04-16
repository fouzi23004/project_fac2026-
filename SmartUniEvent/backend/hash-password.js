const bcrypt = require('bcryptjs');

const password = 'Admin@123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
  console.log('Password hash for "Admin@123":');
  console.log(hash);
  process.exit(0);
});
