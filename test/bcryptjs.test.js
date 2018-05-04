'use strict';

var bcrypt = require('bcryptjs');

var password = 'PIPPOPluto';
var salt = bcrypt.genSaltSync(10);
console.log(salt);

var hash = bcrypt.hashSync(password, '$2a$10$IbCAY0aE7VjKGL9WhF/ezu');

console.log('HASH1:', hash);

hash = bcrypt.hashSync(password, salt);

console.log('HASH2:', hash);

hash = bcrypt.hashSync(password, salt);

console.log('HASH3:', hash);