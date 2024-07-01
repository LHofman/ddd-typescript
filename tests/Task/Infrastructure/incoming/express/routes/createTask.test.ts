import request from 'supertest';
import app from '../../../../../../src/app';

describe('Create task', () => {
  test('creating a new task', async () => {
    const res = await request(app).post('/tasks').send({ description: 'test' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(isNaN(res.body.id)).toBeFalsy();
  })
});
