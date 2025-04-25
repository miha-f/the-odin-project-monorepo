class DbError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 500;
        this.name = "DbError";
    }
};

module.exports = DbError;
