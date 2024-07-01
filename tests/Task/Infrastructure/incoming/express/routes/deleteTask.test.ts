import request from 'supertest';
import app from '../../../../../../src/app';

describe('Delete task', () => {
  test('deleting a task', async () => {
    const res = await request(app).delete('/tasks/1');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Task successfully deleted');

    const getRes = await request(app).get('/tasks/1');
    expect(getRes.statusCode).toEqual(404);
  })
});
