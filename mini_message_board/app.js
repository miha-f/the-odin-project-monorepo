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
app.locals.getCurrentYear = () => {
    return new Date().getFullYear();
};

const ITEMS_PER_PAGE = 20;

app.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const totalMessages = await prisma.message.count();
    const totalPages = Math.ceil(totalMessages / ITEMS_PER_PAGE);


    const messages = await prisma.message.findMany({
        skip: skip,
        orderBy: {
            date: 'desc'
        },
        take: ITEMS_PER_PAGE,
    });
    console.log(messages);
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
    res.render('index', { title: 'Home', messages: formattedMessages, page: page, totalPages: totalPages });
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
