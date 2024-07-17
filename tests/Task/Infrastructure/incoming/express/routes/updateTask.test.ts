import request from 'supertest';
import app from '../../../../../../src/app';

describe('Update task', () => {
  test('updating a task description', async () => {
    const res = await request(app).put('/tasks/51c47413-6adf-4514-b3b8-22a3df7935ef')
      .send({ description: 'updated description' });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Task successfully updated');

    const getRes = await request(app).get('/tasks/51c47413-6adf-4514-b3b8-22a3df7935ef');
    expect(getRes.statusCode).toEqual(200);
    expect(getRes.body).toBeInstanceOf(Object);
    expect(getRes.body.description).toEqual('updated description');
  });
});
