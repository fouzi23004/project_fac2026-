const bcrypt = require('bcryptjs');

const password = 'Admin@123';
const hash = '$2b$10$ROtSFaGZNU7gHmO9cBntqecdzi0PAqMd.iH0lSmDL/gzso13S3WOi';

bcrypt.compare(password, hash, (err, result) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
  console.log('Password matches:', result);

  // Also test with bcryptjs
  const bcrypt2 = require('bcryptjs');
  bcrypt2.compare(password, hash, (err2, result2) => {
    if (err2) {
      console.error('Error2:', err2);
      process.exit(1);
    }
    console.log('bcryptjs matches:', result2);
    process.exit(0);
  });
});
