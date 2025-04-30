const pool = require("./db/db.js");

const postsModel = (() => {

    const getAllCount = async () => {
        let query = 'SELECT COUNT(*) FROM posts';
        const res = await pool.query(query);
        return res.rows[0];
    };

    const getAll = async (limit = undefined, offset = undefined) => {
        let query = 'SELECT * FROM posts';
        if (limit)
            query += ` LIMIT ${limit}`;
        if (offset)
            query += ` OFFSET ${offset}`;
        const res = await pool.query(query);
        return res.rows;
    };

    const getAllWithUserInfo = async (limit = undefined, offset = undefined) => {
        let query = `SELECT 
                p.id, p.title, p.text, p.updated_at, u.id as user_id, u.username, u.email, u.role
                FROM posts p
                LEFT JOIN users u ON p.user_id = u.id
            `;
        if (limit)
            query += ` LIMIT ${limit}`;
        if (offset)
            query += ` OFFSET ${offset}`;
        const res = await pool.query(query);
        return res.rows;
    };

    const getById = async (id) => {
        let query = 'SELECT * FROM posts WHERE id = $1';
        const res = await pool.query(query, [id]);
        return res.rows;
    };

    const getByIdWithUserInfo = async (id) => {
        let query = `SELECT 
                p.id, p.title, p.text, p.updated_at, u.id as user_id, u.username, u.email, u.role
                FROM posts p
                LEFT JOIN users u ON p.user_id = u.id
                WHERE p.id = $1
            `;
        const res = await pool.query(query, [id]);
        return res.rows[0];
    };

    const create = async ({ title, text, user_id }) => {
        const query = `INSERT INTO posts 
                       (title, text, user_id) 
                VALUES ($1, $2, $3) RETURNING *`;
        const res = await pool.query(query, [title, text, user_id]);
        return res.rows[0];
    };

    const removeById = async (id) => {
        const query = 'DELETE FROM posts WHERE id = $1 RETURNING *';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    };

    const updateById = async (id, { title = undefined, text = undefined }) => {
        const query = `
            UPDATE posts
            SET 
                title = COALESCE($2, title),
                text = COALESCE($3, text),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;

        const res = await pool.query(query, [id, title, text]);
        return res.rows[0];
    };

    return {
        getAllCount,
        getAll,
        getAllWithUserInfo,
        getById,
        getByIdWithUserInfo,
        create,
        removeById,
        updateById,
    };
})();

module.exports = postsModel;
