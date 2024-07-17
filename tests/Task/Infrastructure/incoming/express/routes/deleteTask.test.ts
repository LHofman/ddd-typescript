import request from 'supertest';
import app from '../../../../../../src/app';

describe('Delete task', () => {
  test('deleting a task', async () => {
    const res = await request(app).delete('/tasks/51c47413-6adf-4514-b3b8-22a3df7935ef');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Task successfully deleted');

    const getRes = await request(app).get('/tasks/51c47413-6adf-4514-b3b8-22a3df7935ef');
    expect(getRes.statusCode).toEqual(404);
  })
});
