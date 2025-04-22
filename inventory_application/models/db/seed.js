const pool = require("./db.js");
const { faker } = require('@faker-js/faker');

const seedCompanies = async (n = 5) => {
    const companies = [];
    for (let i = 0; i < n; i++) {
        companies.push(faker.company.name());
    }

    for (const name of companies) {
        await pool.query("INSERT INTO companies (name) VALUES ($1)", [name]);
    }

    return companies;
};

const seedCategories = async (n = 5) => {
    const categories = [];
    for (let i = 0; i < n; i++) {
        categories.push(faker.commerce.department());
    }

    for (const name of categories) {
        await pool.query("INSERT INTO categories (name) VALUES ($1)", [name]);
    }

    return categories;
}

const seedItems = async (companies, categories, n = 5) => {
    const items = [];
    for (let i = 0; i < n; i++) {
        const name = faker.commerce.productName();
        const description = faker.lorem.sentence();
        const imageUrl = "https://placehold.co/100x100";
        const categoryId = Math.floor(Math.random() * categories.length) + 1;
        const companyId = Math.floor(Math.random() * companies.length) + 1;
        items.push({ name, description, imageUrl, categoryId, companyId });
    }

    for (const { name, description, imageUrl, categoryId, companyId } of items) {
        await pool.query(
            "INSERT INTO items (name, description, image_url, category_id, company_id) VALUES ($1, $2, $3, $4, $5)",
            [name, description, imageUrl, categoryId, companyId]
        );
    }

    return items;
}

const seedStocks = async (items) => {
    for (const item of items) {
        const quantity = Math.floor(Math.random() * 100) + 1;
        const price = faker.commerce.price();
        const itemId = item.id;
        await pool.query(
            "INSERT INTO stocks (item_id, quantity, price) VALUES ($1, $2, $3)",
            [itemId, quantity, price]
        );
    }
};

async function main() {
    try {
        const companies = await seedCompanies(50);
        const categories = await seedCategories(15);
        const items = await seedItems(companies, categories, 1000);
        await seedStocks(items);
        console.log('Tables seeded successfully!');
    } catch (error) {
        console.error('Error seeding tables:', error);
    } finally {
        pool.end();
    }
};

main();
