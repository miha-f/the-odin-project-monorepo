const pool = require("./db.js");

const main = async () => {
    const query = `DROP TABLE IF EXISTS store;`;

    try {
        await pool.query(query);
        console.log('Tables dropped successfully!');
    } catch (error) {
        console.error('Error dropping tables:', error);
    } finally {
        pool.end();
    }
};

main();
