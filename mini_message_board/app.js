const express = require('express');
const path = require('path');
const prisma = require('./db');

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

app.get('/', async (req, res) => {
    const messages = await prisma.message.findMany({
        orderBy: {
            date: 'desc'
        },
        take: 20,
    });
    const formattedMessages = messages.map(msg => ({
        ...msg,
        formattedDate: msg.date.toLocaleDateString('en-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }));
    res.render('index', { title: 'Home', messages: formattedMessages });
});

app.get('/new', (req, res) => {
    res.render('new', { title: 'New' });
});

app.post('/new', async (req, res) => {
    const { username, message } = req.body;
    const date = new Date();
    await prisma.message.create({
        data: { username, message, date },
    });
    res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
