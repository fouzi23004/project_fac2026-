UPDATE users
SET password_hash = '$2b$10$ROtSFaGZNU7gHmO9cBntqecdzi0PAqMd.iH0lSmDL/gzso13S3WOi'
WHERE email = 'admin@university.edu';

SELECT email, substring(password_hash, 1, 20) as hash_preview
FROM users
WHERE email = 'admin@university.edu';
