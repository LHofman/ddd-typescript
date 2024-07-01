import request from 'supertest';
import app from '../../../../../../src/app';

describe('get all tasks', () => {
  test('fetching all tasks should return 200', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).not.toHaveLength(0);
  })
});
