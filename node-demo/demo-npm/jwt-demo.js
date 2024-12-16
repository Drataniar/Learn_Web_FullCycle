var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');

dotenv.config();

var token = jwt.sign({aa : 'bbb'},process.env.PRIVATE_KEY);
//토큰 생성 = jwt 서명(페이로드, 나만의 암호키)

console.log(token);

var decode = jwt.verify(token,process.env.PRIVATE_KEE);
console.log(decode);