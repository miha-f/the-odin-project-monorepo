import dotenv from 'dotenv';
dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

import app from './app.js';

const PORT = process.env.BACKEND_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
