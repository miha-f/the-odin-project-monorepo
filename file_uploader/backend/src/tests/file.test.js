process.env.NODE_ENV = 'test';
import request from 'supertest';
import app from '../app';
import { log } from 'console';

describe('File Routes', () => {
    it('GET /files returns list', async () => {
        const res = await request(app).get('/files');
        expect(res.statusCode).toBe(200);
        expect(res.body[0].name).toBe('Resume.pdf');
    });

    it('GET /files/file-2 returns file', async () => {
        const res = await request(app).get('/files/file-2');
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Vacation.jpg');
    });

    it('GET /files/fifadsle-2 returns null', async () => {
        const res = await request(app).get('/files/fifadsle-2');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not found');
    });

    it('POST /files creates file', async () => {
        const res = await request(app)
            .post('/files')
            .send({ name: 'Dates.pdf', type: 'text/plain', size: 234_000, ownerUUid: 'user-1', folderUUid: 'folder-1' });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Dates.pdf');
    });

    it('PATCH /files/file-2 returns file', async () => {
        const res = await request(app)
            .patch('/files/file-2')
            .send({ name: 'New Vacation.jpg' });
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('New Vacation.jpg');
    });

    it('DELETE /files/file-2 returns 204', async () => {
        const res = await request(app).delete('/files/file-2');
        expect(res.statusCode).toBe(204);
    });
});
