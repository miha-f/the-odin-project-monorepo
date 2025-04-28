const renderLayout = (req, res, next) => {
    const originalRender = res.render;
    res.render = function(view, options = {}, callback) {
        options.view = `pages/${view}`;
        return originalRender.call(this, 'layout', options, callback);
    };
    next();
}

const queryBuilder = (req, res, next) => {
    function updateQuery(currentQuery, updates) {
        return new URLSearchParams({ ...currentQuery, ...updates }).toString();
    }

    res.locals.updateQuery = (updates) => updateQuery(req.query, updates);
    res.locals.query = req.query;
    next();
}

module.exports = {
    renderLayout,
    queryBuilder,
};
