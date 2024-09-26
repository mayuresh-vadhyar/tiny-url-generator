'use strict';
const { Logger } = require('./logger');
const path = ['alias-map'];

class AliasMap {

    constructor() {
        Logger.log(path, 'Creating alias map');
        this.active = new Map();
    }

    getAlias(key) {
        const alias = this.active.get(key);
        if (!alias || alias && alias.isExpired()) {
            throw new Error('Alias does not exist or has expired');
        }
        return alias;
    }

    addAlias(alias) {
        if (alias.constructor.name !== 'Alias') {
            throw new Error('Incompatible type for alias');
        }
        this.active.set(alias.custom_alias, alias);
        setTimeout(() => alias.expire(), alias.ttl_seconds * 1000);
        return alias.custom_alias;
    }

    expireAlias(customAlias) {
        Logger.log(path, 'Deleting Alias - ', customAlias)
        this.active.delete(customAlias);
        return true;
    }

}

class AliasMapSingleton {
    aliasMap = null;

    static getAliasMap() {
        if (!this.aliasMap) {
            this.aliasMap = new AliasMap();
        }
        return this.aliasMap;
    }
}

module.exports = { AliasMap: AliasMapSingleton };