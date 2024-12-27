'use strict';
const crypto = require('crypto');
const filePath = ['alias-generator'];

class AliasGenerator {
    static createHashAlias(longUrl) {
        const currentTime = Date.now();
        const input = `${longUrl}-${currentTime}`;

        const hash = crypto.createHash('sha256').update(input).digest('hex');
        return hash.substring(0, 6);
    }

}

module.exports = { AliasGenerator };