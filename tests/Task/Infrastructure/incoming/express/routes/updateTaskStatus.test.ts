import request from 'supertest';
import app from '../../../../../../src/app';

describe('Start task', () => {
  test('starting a task in status To Do', async () => {
    const taskRes = await request(app).post('/tasks').send({ description: 'new task' });
    const taskId = taskRes.body.id;

    const res = await request(app).put(`/tasks/${taskId}/start`);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Task successfully started');

    const getRes = await request(app).get('/tasks/1');
    expect(getRes.body.status).toEqual('In Progress');
  });

  test('starting a task in status In Progess', async () => {
    const taskRes = await request(app).post('/tasks').send({ description: 'new task' });
    const taskId = taskRes.body.id;

    await request(app).put(`/tasks/${taskId}/start`);
    const res2 = await request(app).put(`/tasks/${taskId}/start`);
    expect(res2.statusCode).toEqual(400);
    expect(res2.text).toEqual('A Task with Status In Progress cannot be started');
  });
});
