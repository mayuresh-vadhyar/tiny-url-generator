'use strict';
const crypto = require('crypto');
const { AliasMap } = require('./alias-map');
const filePath = ['alias-generator'];

class AliasGenerator {
    static generateAlias(longUrl) {
        const aliasMap = AliasMap.getAliasMap().active;
        let alias;
        do {
            Logger.log(filePath, `Generating alias for URL: ${longUrl}`);
            alias = AliasGenerator.createHashAlias(longUrl);
        } while (aliasMap.has(alias));

        Logger.log(filePath, `Generated alias "${alias}" for URL: ${longUrl}`);
        return alias;
    }

    static createHashAlias(longUrl) {
        const currentTime = Date.now();
        const input = `${longUrl}-${currentTime}`;

        const hash = crypto.createHash('sha256').update(input).digest('hex');
        return hash.substring(0, 6);
    }

}

module.exports = { AliasGenerator };