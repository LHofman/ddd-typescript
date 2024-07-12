import request from 'supertest';
import app from '../../../../../../src/app';

describe('Add Sub Task', () => {
  test('Adding a Sub Task should return 400 error when id is not numeric', async () => {
    const res = await request(app).put('/tasks/abc/addSubTask').send({ subTaskId: 2 });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Invalid ID');
  });

  test('Adding a Sub Task should return 400 error when id is 0', async () => {
    const res = await request(app).put('/tasks/0/addSubTask').send({ subTaskId: 2 });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Task Id must be greater than 0');
  });

  test('Adding a Sub Task should return 400 error when id is not known', async () => {
    const res = await request(app).put('/tasks/999/addSubTask').send({ subTaskId: 2 });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Task not found');
  });

  test('Adding a Sub Task should return 400 error when Sub Task id is not numeric', async () => {
    const res = await request(app).put('/tasks/1/addSubTask').send({ subTaskId: 'abc' });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Invalid ID');
  });

  test('Adding a Sub Task should return 400 error when Sub Task id is 0', async () => {
    const res = await request(app).put('/tasks/1/addSubTask').send({ subTaskId: 0 });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Task Id must be greater than 0');
  });

  test('Adding a Sub Task should return 400 error when Sub Task id is not known', async () => {
    const res = await request(app).put('/tasks/1/addSubTask').send({ subTaskId: 999 });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Task not found');
  });

  test('Adding a Sub Task should return 200 error when ids are known', async () => {
    const res = await request(app).put('/tasks/1/addSubTask').send({ subTaskId: 2 });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('SubTask successfully added to Task');

    const getRes = await request(app).get('/tasks/1');
    expect(getRes.body.subTasks.some((subTask) => subTask.id === 2)).toBeTruthy();
  });
});
