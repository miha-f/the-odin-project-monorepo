const pool = require("./db/db.js");

class Item {
    static async getAllCount() {
        let query = 'SELECT COUNT(*) FROM items';
        const res = await pool.query(query);
        return res.rows[0];
    }

    static async getAll(limit = undefined, offset = undefined) {
        let query = 'SELECT * FROM items';
        if (limit)
            query += ` LIMIT ${limit}`;
        if (offset)
            query += ` OFFSET ${offset}`;
        const res = await pool.query(query);
        return res.rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM items WHERE id = $1';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    }

    static async findByIdDetailed(id) {
        let query = `select s.price, s.quantity, i.updated_at, i.created_at, i.name as item_name, 
                    i.id as item_id, i.description, i.image_url, c.name as company_name, 
                    c.id as company_id, c2.name as category_name, c2.id as category_id 
                from stocks s 
                left join items i on s.item_id = i.id 
                left join companies c on i.company_id = c.id 
                left join categories c2 on i.category_id = c2.id
                where i.id = $1`;
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
    static async getAllCount() {
        let query = 'SELECT COUNT(*) FROM companies';
        const res = await pool.query(query);
        return res.rows[0];
    }

    static async getAll(limit = undefined, offset = undefined, sortField = undefined, sortDirection = undefined) {
        let query = 'SELECT * FROM companies';
        if (sortField && sortDirection)
            query += sortDirection === "desc" ? ` ORDER BY ${sortField} DESC` : ` ORDER BY ${sortField}`;
        if (limit)
            query += ` LIMIT ${limit}`;
        if (offset)
            query += ` OFFSET ${offset}`;
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
    static async getAllCount() {
        let query = 'SELECT COUNT(*) FROM categories';
        const res = await pool.query(query);
        return res.rows[0];
    }

    static async getAll(limit = undefined, offset = undefined, sortField = undefined, sortDirection = undefined) {
        let query = 'SELECT * FROM categories';
        if (sortField && sortDirection)
            query += sortDirection === "desc" ? ` ORDER BY ${sortField} DESC` : ` ORDER BY ${sortField}`;
        if (limit)
            query += ` LIMIT ${limit}`;
        if (offset)
            query += ` OFFSET ${offset}`;
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
    static async getAllCount(search = undefined) {
        let query = `select count(*)
                from stocks s 
                left join items i on s.item_id = i.id 
                left join companies c on i.company_id = c.id 
                left join categories c2 on i.category_id = c2.id`;
        if (search)
            query += ` WHERE i."name" ILIKE '${search}%'`;
        const res = await pool.query(query);
        return res.rows[0];
    }

    static async getAllDetailed(search = undefined, limit = undefined, offset = undefined, sortField = undefined, sortDirection = undefined) {
        let query = `select s.price, s.quantity, s.updated_at, i.name as item_name, 
                    i.id as item_id, i.description, i.image_url, c.name as company_name, 
                    c.id as company_id, c2.name as category_name, c2.id as category_id 
                from stocks s 
                left join items i on s.item_id = i.id 
                left join companies c on i.company_id = c.id 
                left join categories c2 on i.category_id = c2.id`;
        if (search)
            query += ` WHERE i."name" ILIKE '${search}%'`;
        if (sortField && sortDirection)
            query += sortDirection === "desc" ? ` ORDER BY ${sortField} DESC` : ` ORDER BY ${sortField}`;
        if (limit)
            query += ` LIMIT ${limit}`;
        if (offset)
            query += ` OFFSET ${offset}`;
        const res = await pool.query(query);
        return res.rows;
    }

    static async getAll(limit = undefined, offset = undefined) {
        let query = 'SELECT * FROM stocks';
        if (limit)
            query += ` LIMIT ${limit}`;
        if (offset)
            query += ` OFFSET ${offset}`;
        const res = await pool.query(query);
        return res.rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM stocks WHERE id = $1';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    }

    static async create(itemId, quantity, price) {
        const query = 'INSERT INTO stocks (item_id, quantity, price) VALUES ($1, $2, $3) RETURNING *';
        const res = await pool.query(query, [itemId, quantity, price]);
        return res.rows[0];
    }

    static async update(id, quantity = null, price = null) {
        const query = `
            UPDATE stocks
            SET 
                quantity = COALESCE($2, quantity),
                price = COALESCE($3, price),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;

        const res = await pool.query(query, [id, quantity, price]);
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
