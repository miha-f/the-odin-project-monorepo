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

const addUserToLocals = (req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.role = req.user?.role ?? 'user';
    next();
};

const auth = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
}

const memberOrAdmin = (req, res, next) => {
    const role = req.user?.role;
    if (role === 'member' || role === 'admin') {
        return next();
    }
    res.redirect('/users/login');
}

module.exports = {
    renderLayout,
    queryBuilder,
    addUserToLocals,
    auth,
    memberOrAdmin,
};
