const defaultTTL = 120;
const port = process.env.PORT || 3000;
const baseURL = `http://localhost:${port}`;
const DEFAULT_ACCESS_LOGS_COUNT = 10;

module.exports = {
    defaultTTL,
    port,
    baseURL,
    DEFAULT_ACCESS_LOGS_COUNT
}