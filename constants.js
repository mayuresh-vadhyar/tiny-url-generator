const defaultTTL = 120;
const port = process.env.PORT || 3000;
const baseURL = `http://localhost:${port}`;
const DEFAULT_ACCESS_LOGS_COUNT = 10;
const EXPIRY_CHECK_INTERVAL = 1000;

module.exports = {
    defaultTTL,
    port,
    baseURL,
    EXPIRY_CHECK_INTERVAL,
    DEFAULT_ACCESS_LOGS_COUNT
}