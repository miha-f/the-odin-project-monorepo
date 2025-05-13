import express from 'express';

import fileApi from './api/file.js';

const app = express();

app.use(express.json());
app.get('/', (req, res) => res.send("ok"));
app.use('/files', fileApi);

export default app;
