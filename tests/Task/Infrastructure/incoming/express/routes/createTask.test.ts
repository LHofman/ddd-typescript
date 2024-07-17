import request from 'supertest';
import { validate as uuidValidate } from 'uuid';
import app from '../../../../../../src/app';

describe('Create task', () => {
  test('creating a new task', async () => {
    const res = await request(app).post('/tasks').send({ description: 'test' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(uuidValidate(res.body.id)).toBeTruthy();

    const tasksRes = await request(app).get('/tasks');
    expect(tasksRes.body.at(-1).status).toBe('To Do');
  })
});
