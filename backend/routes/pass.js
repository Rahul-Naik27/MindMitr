// generateHash.js
const bcrypt = require('bcryptjs');

const password = 'admin123'; // Change this
bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    console.log('Bcrypt hash:', hash);
});

// Run: node generateHash.js