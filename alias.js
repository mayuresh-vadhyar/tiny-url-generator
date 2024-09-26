'use strict';
const uuid = require("uuid");
const constants = require('./constants');
const { Logger } = require('./logger');
const { AliasMap } = require('./alias-map');
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
        this.custom_alias = customAlias ?? this.generateCustomAlias();
        this.ttl_seconds = ttl ?? constants.defaultTTL;
        this.created = new Date();
        Logger.log(filePath, 'Created Alias', this.custom_alias, 'at', this.created.toISOString());
    }

    generateCustomAlias() {
        const randomId = uuid.v4().split('-')[0];
        Logger.log(filePath, 'Custom alias generated', randomId);
        const aliasMap = AliasMap.getAliasMap().active;
        if (aliasMap.has(randomId)) {
            Logger.error(filePath, 'Custom alias already exists');
            return generateCustomAlias();
        }
        return randomId;
    }

    getUrl() {
        this.logAliasAccess();
        return this.long_url;
    }

    expire() {
        const aliasMap = AliasMap.getAliasMap();
        if(!aliasMap.has(this.custom_alias)) {
            throw new Error('Alias does not exist or has expired');
        }
        aliasMap.expireAlias(this.custom_alias);
    }

    isExpired() {
        const currentTime = new Date().getTime();
        const createdTime = this.created.getTime();
        const diff = (currentTime - createdTime) / 1000;
        return diff > this.ttl_seconds;
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

const sampleAliasActiveMap = {
    "112": {
        "long_url": "https://www.example.com/some/very/long/url",
        "custom_alias": "myalias",
        "ttl_seconds": 60,
        "created": "2024-07-21T12:34:56Z",
        "access_count": 0,
        "access_times": [
            "2024-09-04T19:11:56Z",
            "2024-09-04T19:11:53Z",
            "2024-09-04T19:12:58Z",
            "2024-09-04T19:12:55Z",
            "2024-09-04T19:12:53Z",
            "2024-09-04T19:11:52Z",
            "2024-09-04T19:12:56Z",
            "2024-09-04T19:12:59Z",
            "2024-09-04T19:12:57Z",
            "2024-09-04T19:12:54Z",
            "2024-09-04T19:12:52Z",
            "2024-09-04T19:13:10Z",
            "2024-09-04T19:13:00Z"
        ]
    }
};

module.exports = { Alias };