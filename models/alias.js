'use strict';
const constants = require('../utils/constants');
const { Logger } = require('../utils/logger');
const { AliasGenerator } = require('./alias-generator');
const filePath = ['alias'];

class Alias {
    long_url = null;
    custom_alias = null;
    ttl_seconds = null;
    created = null;
    access_count = 0;
    access_times = [];

    constructor(longUrl, customAlias, ttl) {
        this.long_url = longUrl;
        this.custom_alias = customAlias ?? AliasGenerator.generateAlias();
        this.ttl_seconds = ttl ?? constants.defaultTTL;
        this.created = new Date();
        Logger.log(filePath, 'Created Alias', this.custom_alias, 'at', this.created.toISOString());
    }

    getUrl() {
        this.logAliasAccess();
        return this.long_url;
    }

    incrementAccessCount() {
        return ++this.access_count;
    }

    logAliasAccess() {
        this.access_times.unshift(new Date().toISOString());
        this.incrementAccessCount();
    }

    getRecentAccessLogs(count) {
        count = count || constants.DEFAULT_ACCESS_LOGS_COUNT;
        return this.access_times.slice(0, count);
    }

    getAnalytics() {
        const recentAccess = this.getRecentAccessLogs(constants.DEFAULT_ACCESS_LOGS_COUNT);
        this.logAliasAccess();
        return {
            alias: this.custom_alias,
            access_count: this.access_count,
            access_times: recentAccess,
            long_url: this.long_url
        }
    }
}

module.exports = { Alias };