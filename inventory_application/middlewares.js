const ForbiddenError = require("./errors/authError");

const renderLayout = (req, res, next) => {
    console.log("A", req.locals)
    const originalRender = res.render;
    res.render = function(view, options = {}, callback) {
        options.view = `pages/${view}`;
        return originalRender.call(this, 'layout', options, callback);
    };
    next();
}

const queryBuilder = (req, res, next) => {
    console.log("B", req.locals)
    function updateQuery(currentQuery, updates) {
        return new URLSearchParams({ ...currentQuery, ...updates }).toString();
    }

    res.locals.updateQuery = (updates) => updateQuery(req.query, updates);
    res.locals.query = req.query;
    next();
}

function auth(req, res, next) {
    const auth = true;

    if (auth)
        res.locals = { user: { username: "John Doe" } };
    else
        res.locals = { user: undefined };

    next();
}

module.exports = {
    renderLayout,
    queryBuilder,
    auth,
};
