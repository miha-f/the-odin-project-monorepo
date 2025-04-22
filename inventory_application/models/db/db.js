const { Pool } = require("pg");

module.exports = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/store"
});
