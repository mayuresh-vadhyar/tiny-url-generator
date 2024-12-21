'use strict';
const { Logger } = require('../../utils/logger');
const constants = require('../../utils/constants');
const { MinHeap } = require('./min-heap');
const path = ['alias-map'];

class AliasMap {

    constructor() {
        Logger.log(path, 'Creating alias map');
        this.active = new Map();
        this.expiryHeap = new MinHeap();
        this.runExpiryWorker()
    }

    getAlias(key) {
        const alias = this.active.get(key);
        if (!alias) {
            throw new Error(`Alias ${key} does not exist or has expired`);
        }
        return alias;
    }

    addAlias(alias) {
        if (alias.constructor.name !== 'Alias') {
            throw new Error('Incompatible type for alias');
        }

        const currentTime = Date.now();
        const expireAt = currentTime + alias.ttl_seconds * 1000;

        this.active.set(alias.custom_alias, alias);
        // setTimeout(() => alias.expire(), alias.ttl_seconds * 1000);
        this.expiryHeap.insert({ alias: alias.custom_alias, expireAt });
        Logger.log(path, `Alias added: ${alias.custom_alias} with TTL: ${alias.ttl_seconds}s`);

        return alias.custom_alias;
    }

    expireAlias(customAlias) {
        Logger.log(path, 'Deleting Alias - ', customAlias)
        this.active.delete(customAlias);
        return true;
    }

    runExpiryWorker() {
        setInterval(() => {
            const currentTime = Date.now();
            let nextToExpire = this.expiryHeap.peek();

            while (nextToExpire && nextToExpire.expireAt <= currentTime) {
                // Remove expired alias
                this.expiryHeap.extractMin();
                this.expireAlias(nextToExpire.alias);
                Logger.log(['alias-map'], `Alias ${nextToExpire.alias} expired`);
                nextToExpire = this.expiryHeap.peek();
            }

        }, constants.EXPIRY_CHECK_INTERVAL);
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