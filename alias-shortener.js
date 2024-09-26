'use strict';
const constants = require('./constants');
const { Alias } = require('./alias');
const { AliasMap } = require('./alias-map');
const { Logger } = require("./logger");
const aliasMap = AliasMap.getAliasMap();
const filePath = ['alias-shortener'];

const shortenUrl = async function (req, res) {
    const apiPath = [...filePath, 'shortenUrl'];
    try {
        let { custom_alias: customAlias, long_url: longUrl, ttl_seconds: ttl } = req.body;
        if (!longUrl) {
            return res.status(400).send('Long url not specified');
        }

        customAlias = aliasMap.addAlias(new Alias(longUrl, customAlias, ttl));
        return res.status(200).send({ url: `${constants.baseURL}/${customAlias}` });
    } catch (e) {
        Logger.error(apiPath, e.message);
        return res.status(404).send({message: e.message});
    }
}

const deleteAlias = function (req, res) {
    const apiPath = [...filePath, 'deleteAlias'];
    try {
        const existingAlias = aliasMap.getAlias(req.params.alias);
        existingAlias.expire();
        return res.status(200).send('Successfully deleted');
    } catch (e) {
        Logger.error(apiPath, e.message);
        return res.status(404).send({message: e.message});
    }
}

const updateAlias = function (req, res) {
    const apiPath = [...filePath, 'updateAlias'];
    try {
        const existingAlias = aliasMap.getAlias(req.params.alias);
        let { custom_alias: customAlias, ttl_seconds: ttl } = req.body;
        const longUrl = existingAlias.long_url
        if (!ttl) {
            ttl = existingAlias.ttl_seconds;
        }
        if (!customAlias) {
            customAlias = existingAlias.custom_alias;
        }

        existingAlias.expire();
        aliasMap.addAlias(new Alias(longUrl, customAlias, ttl));

        return res.status(200).send('Successfully updated')
    } catch (e) {
        Logger.error(apiPath, e.message);
        res.status(404).send({message: e.message});
    }
}


const redirectToAlias = function (req, res) {
    const apiPath = [...filePath, 'redirectToAlias'];
    try {
        const alias = aliasMap.getAlias(req.params.alias);
        const url = alias.getUrl();
        if (!url) {
            return res.status(404).send('Alias does not exist or has expired');
        }
        return res.redirect(url, 302);
    } catch (e) {
        Logger.error(apiPath, e.message);
        return res.status(404).send({message: e.message});
    }
}

const getAliasAnalytics = function (req, res) {
    const apiPath = [...filePath, 'getAliasAnalytics'];
    try {
        const alias = aliasMap.getAlias(req.params.alias);
        const aliasAnalytics = alias.getAnalytics();
        return res.status(200).send(aliasAnalytics);
    } catch (e) {
        Logger.error(apiPath, e.message);
        return res.status(404).send({message: e.message});
    }
}

module.exports = { shortenUrl, redirectToAlias, getAliasAnalytics, updateAlias, deleteAlias }
