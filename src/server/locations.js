const { runSelectQuery } = require('./db');

const getLocations = async (query, db) => (
    query.length >= 3 ?
        runSelectQuery(getLocationsQuery(query), db) :
        []
);

getLocationsQuery = (query) => (
    `SELECT geonameid, name FROM locations WHERE name LIKE '%${query}%'`
);

module.exports = { getLocations };