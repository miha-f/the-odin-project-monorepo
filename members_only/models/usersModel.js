const pool = require("./db/db.js");

const usersModel = (() => {

    const getAllCount = async () => {
        let query = 'SELECT COUNT(*) FROM users';
        const res = await pool.query(query);
        return res.rows[0];
    };

    const getAll = async (limit = undefined, offset = undefined) => {
        let query = 'SELECT id, username, email, role, updated_at FROM users';
        if (limit)
            query += ` LIMIT ${limit}`;
        if (offset)
            query += ` OFFSET ${offset}`;
        const res = await pool.query(query);
        return res.rows;
    };

    const getByEmail = async (email) => {
        let query = `SELECT id, username, email, role, updated_at 
                     FROM users WHERE email = $1`;
        const res = await pool.query(query, [email]);
        return res.rows[0];
    };

    const getByEmailWithPasswordHash = async (email) => {
        let query = `SELECT id, username, email, role, updated_at, password_hash
                     FROM users WHERE email = $1`;
        const res = await pool.query(query, [email]);
        return res.rows[0];
    };

    const getById = async (id) => {
        let query = `SELECT id, username, email, role, updated_at 
                     FROM users WHERE id = $1`;
        const res = await pool.query(query, [id]);
        return res.rows[0];
    };

    const getByUsername = async (username) => {
        let query = `SELECT id, username, email, role, updated_at 
                     FROM users WHERE username = $1`;
        const res = await pool.query(query, [username]);
        return res.rows[0];
    };

    const create = async ({ username, email, role, password_hash }) => {
        const query = `INSERT INTO users
                       (username, email, role, password_hash) 
                VALUES ($1, $2, $3, $4) RETURNING *`;
        const res = await pool.query(query, [username, email, role, password_hash]);
        return res.rows[0];
    };

    const removeById = async (id) => {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    };

    const updateById = async (id, {
        username = undefined,
        email = undefined,
        role = undefined,
        password_hash = undefined,
    }) => {
        const query = `
            UPDATE users
            SET 
                username = COALESCE($2, username),
                email= COALESCE($3, email),
                role = COALESCE($4, role),
                password_hash = COALESCE($5, password_hash),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;

        const res = await pool.query(query, [id, username, email, role, password_hash]);
        return res.rows[0];
    };

    return {
        getAllCount,
        getAll,
        getById,
        create,
        removeById,
        updateById,
        getByEmailWithPasswordHash,
        getByUsername,
        getByEmail,
    };
})();

module.exports = usersModel;
