const crypto = require('crypto');

const password = '1234';

const salt = crypto.randomBytes(64).toString('base64');
const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');
//(password = 바꿀 변수, salt, 10000, 10=길이, 'sha512')
console.log(hashPassword);