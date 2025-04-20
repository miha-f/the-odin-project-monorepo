const express = require('express');
const path = require('path');
const storage = require('./db');
storage.addMessage({ username: "jake", message: "hi" });
storage.addMessage({ username: "alice", message: "hello world" });
storage.addMessage({ username: "jake", message: "what a beatuful day!" });
storage.addMessage({ username: "alice", message: "can't wait for the icecream" });

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
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const messages = storage.getMessages();
    res.render('index', { title: 'Home', messages: messages });
});

app.get('/new', (req, res) => {
    res.render('new', { title: 'New' });
});

app.post('/new', (req, res) => {
    const { username, message } = req.body;
    storage.addMessage({ username, message });
    res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
