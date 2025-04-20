class Storage {
    constructor() {
        this.storage = [];
        this.id = 0;
    }

    addMessage({ username, message, date = new Date() }) {
        const id = this.id;
        this.storage.push({ id, username, message, date });
        this.id++;
    }

    getMessages() {
        return this.storage;
    }

    getMessage(id) {
        return this.storage[id];
    }
}

module.exports = new Storage();
