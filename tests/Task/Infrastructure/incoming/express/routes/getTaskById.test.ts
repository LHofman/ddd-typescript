import request from 'supertest';
import app from '../../../../../../src/app';

describe('Get task by id', () => {
  test('fetching task by id should return 400 error when id is not uuid format', async () => {
    const res = await request(app).get('/tasks/abc');
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Invalid Task ID');
  });

  test('fetching task by id should return 404 error when id is not known', async () => {
    const res = await request(app).get('/tasks/956105fb-111c-48c4-8273-540fd56e19b4');
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual('Task not found');
  });

  test('fetching task by id should return 200 error when id is known', async () => {
    const res = await request(app).get('/tasks/51c47413-6adf-4514-b3b8-22a3df7935ef');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.id).toEqual('51c47413-6adf-4514-b3b8-22a3df7935ef');
    expect(res.body.subTasks).toBeInstanceOf(Array);
    expect(res.body.subTasks).not.toHaveLength(0);
  });
});
