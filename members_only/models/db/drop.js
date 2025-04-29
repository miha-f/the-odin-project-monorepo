const pool = require("./db.js");

const main = async () => {
    const query = `
        DROP TABLE IF EXISTS users, 
                             posts; 
        DROP TYPE user_role;
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
