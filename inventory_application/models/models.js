const pool = require("./db/db.js");

class Item {
    static async getAll() {
        const query = 'SELECT * FROM items';
        const res = await pool.query(query);
        return res.rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM items WHERE id = $1';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    }

    static async create(name, description, imageUrl, categoryId, companyId) {
        const query = 'INSERT INTO items (name, description, image_url, category_id, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const res = await pool.query(query, [name, description, imageUrl, categoryId, companyId]);
        return res.rows[0];
    }

    static async update(id, name = null, description = null, imageUrl = null, categoryId = null, companyId = null) {
        const query = `
            UPDATE items 
            SET 
                name = COALESCE($2, name),
                description = COALESCE($3, description),
                image_url = COALESCE($4, image_url),
                category_id = COALESCE($5, category_id),
                company_id = COALESCE($6, company_id),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;

        const res = await pool.query(query, [id, name, description, imageUrl, categoryId, companyId]);
        return res.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM items WHERE id = $1 RETURNING *';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    }
};

class Company {
    static async getAll() {
        const query = 'SELECT * FROM companies';
        const res = await pool.query(query);
        return res.rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM companies WHERE id = $1';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    }

    static async create(name) {
        const query = 'INSERT INTO companies (name) VALUES ($1) RETURNING *';
        const res = await pool.query(query, [name]);
        return res.rows[0];
    }

    static async update(id, name = null) {
        const query = `
            UPDATE companies
            SET 
                name = COALESCE($2, name),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;

        const res = await pool.query(query, [id, name]);
        return res.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM companies WHERE id = $1 RETURNING *';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    }
};

class Category {
    static async getAll() {
        const query = 'SELECT * FROM categories';
        const res = await pool.query(query);
        return res.rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM categories WHERE id = $1';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    }

    static async create(name) {
        const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
        const res = await pool.query(query, [name]);
        return res.rows[0];
    }

    static async update(id, name = null) {
        const query = `
            UPDATE categories
            SET 
                name = COALESCE($2, name),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;

        const res = await pool.query(query, [id, name]);
        return res.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    }
};

class Stock {
    static async getAll() {
        const query = 'SELECT * FROM stocks';
        const res = await pool.query(query);
        return res.rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM stocks WHERE id = $1';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    }

    static async create(name, itemId, quantity, price) {
        const query = 'INSERT INTO stocks (name, item_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *';
        const res = await pool.query(query, [name, itemId, quantity, price]);
        return res.rows[0];
    }

    static async update(id, name = null, itemId = null, quantity = null, price = null) {
        const query = `
            UPDATE stocks
            SET 
                name = COALESCE($2, name),
                item_id = COALESCE($3, item_id),
                quantity = COALESCE($4, quantity),
                price = COALESCE($5, price),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;

        const res = await pool.query(query, [id, name, itemId, quantity, price]);
        return res.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM stocks WHERE id = $1 RETURNING *';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    }
};

module.exports = {
    Item,
    Company,
    Category,
    Stock,
};
