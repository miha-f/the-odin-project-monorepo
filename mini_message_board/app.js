const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/materialize', express.static(path.join(__dirname, 'node_modules/materialize-css/dist')));

app.use((req, res, next) => {
    const originalRender = res.render;
    res.render = function(view, options = {}, callback) {
        options.view = `pages/${view}`;
        return originalRender.call(this, 'layout', options, callback);
    };
    next();
});

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/new', (req, res) => {
    res.render('new', { title: 'Home' });
});

app.post('/new', (req, res) => {
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
