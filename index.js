'use strict';
const process = require('process');
const express = require('express');
const constants = require('./constants');
const aliasShortener = require('./alias-shortener')

const app = express();
const port = process.env.PORT || constants.port;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`:::   ${req.method} ${req.originalUrl}   :::`);
    next();
});

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

app.post('/shorten', aliasShortener.shortenUrl);

app.get('/:alias', aliasShortener.redirectToAlias);

app.get('/analytics/:alias', aliasShortener.getAliasAnalytics);

app.put('/update/:alias', aliasShortener.updateAlias);

app.delete('/delete/:alias', aliasShortener.deleteAlias);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
