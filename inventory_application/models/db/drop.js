const pool = require("./db.js");

const main = async () => {
    const query = `
        DROP TABLE IF EXISTS companies, 
                             categories, 
                             items, 
                             stocks;
    `;

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
