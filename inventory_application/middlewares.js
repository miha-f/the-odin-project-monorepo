const renderLayout = (req, res, next) => {
    const originalRender = res.render;
    res.render = function(view, options = {}, callback) {
        options.view = `pages/${view}`;
        return originalRender.call(this, 'layout', options, callback);
    };
    next();
}

module.exports = {
    renderLayout,
};
