const { bcrypt } = require("bcryptjs");
const pool = require("./db.js");
const { faker } = require('@faker-js/faker');

const seedUsers = async (n = 5) => {
    const USER_ROLES = ['user', 'member', 'admin'];

    async function seedUser() {
        // NOTE(miha): All generated users have same password for easier testing.
        // CARE(miha): DON'T USE IN PRODUCTION
        const passwordHash = await bcrypt.hash("password", 10);
        return {
            username: faker.internet.userName(),
            email: faker.internet.email(),
            role: faker.helpers.arrayElement(USER_ROLES),
            password_hash: passwordHash,
            created_at: faker.date.past(),
            updated_at: faker.date.recent(),
        };
    }

    const users = [];
    for (let i = 1; i <= n; i++) {
        users.push({ ...seedUser(), id: i });
    }

    for (const { username, email, role, password_hash, created_at, updated_at } of users) {
        await pool.query(
            "INSERT INTO users (username, email, role, password_hash, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
            [username, email, role, password_hash, created_at, updated_at]
        );
    }

    return users;
};

const seedPosts = async (users, n = 5) => {
    function seedPost(users) {
        const user = faker.helpers.arrayElement(users);
        return {
            title: faker.lorem.words({ min: 3, max: 7 }),
            text: faker.lorem.paragraphs(2),
            user_id: user.id,
            created_at: faker.date.past(),
            updated_at: faker.date.recent(),
        };
    }

    const posts = [];
    for (let i = 1; i <= n; i++) {
        posts.push({ ...seedPost() });
    }

    for (const { title, text, user_id, created_at, updated_at } of users) {
        await pool.query(
            "INSERT INTO posts (title, text, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)",
            [title, text, user_id, created_at, updated_at]
        );
    }

    return posts;
};

async function main() {
    try {
        const users = await seedUsers(100);
        await seedPosts(users, 5000);
        console.log('Tables seeded successfully!');
    } catch (error) {
        console.error('Error seeding tables:', error);
    } finally {
        pool.end();
    }
};

main();
