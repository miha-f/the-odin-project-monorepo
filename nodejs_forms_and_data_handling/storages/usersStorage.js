class UsersStorage {
    constructor() {
        this.storage = {};
        this.id = 0;
    }

    addUser({ firstName, lastName, email, age, bio }) {
        const id = this.id;
        this.storage[id] = { id, firstName, lastName, email, age, bio };
        this.id++;
    }

    getUsers() {
        return Object.values(this.storage);
    }

    getUser(id) {
        return this.storage[id];
    }

    getUserByName(name) {
        return Object.values(this.storage).filter(user =>
            user.firstName.toLowerCase().includes(name.toLowerCase())
        );
    }

    updateUser(id, { firstName, lastName, email, age, bio }) {
        this.storage[id] = { id, firstName, lastName, email, age, bio };
    }

    deleteUser(id) {
        delete this.storage[id];
    }
}

// Rather than exporting the class, we can export an instance of the class by instantiating it.
// This ensures only one instance of this class can exist, also known as the "singleton" pattern.
module.exports = new UsersStorage();
