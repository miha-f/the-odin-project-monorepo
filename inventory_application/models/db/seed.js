const pool = require("./db.js");

const query = `
`;

async function main() {
    try {
        await pool.query(query);
        console.log('Tables seeded successfully!');
    } catch (error) {
        console.error('Error seeding tables:', error);
    } finally {
        pool.end();
    }
};

main();
