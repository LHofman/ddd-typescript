import request from 'supertest';
import app from '../../../../../../src/app';

describe('Get task by id', () => {
  test('fetching task by id should return 400 error when id is not numeric', async () => {
    const res = await request(app).get('/tasks/abc');
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Invalid ID');
  });

  test('fetching task by id should return 400 error when id is 0', async () => {
    const res = await request(app).get('/tasks/0');
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Invalid ID');
  });

  test('fetching task by id should return 404 error when id is not known', async () => {
    const res = await request(app).get('/tasks/999');
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual('Invalid ID');
  });

  test('fetching task by id should return 200 error when id is known', async () => {
    const res = await request(app).get('/tasks/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.id).toEqual(1);
  });
});
