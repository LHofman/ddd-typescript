import request from 'supertest';
import app from '../../../../../../src/app';

describe('Add Sub Task', () => {
  test('Adding a Sub Task should return 400 error when id is not in uuid format', async () => {
    const res = await request(app).put('/tasks/abc/addSubTask')
      .send({ subTaskId: "594b2fd3-e735-44df-969e-a2d0e49c208d" });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Invalid Task ID');
  });

  test('Adding a Sub Task should return 400 error when id is not known', async () => {
    const res = await request(app).put('/tasks/20acbcd3-6d46-4fd3-afbf-38218c194309/addSubTask')
      .send({ subTaskId: "594b2fd3-e735-44df-969e-a2d0e49c208d" });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Task not found');
  });

  test('Adding a Sub Task should return 400 error when Sub Task id is not in uuid format', async () => {
    const res = await request(app).put('/tasks/51c47413-6adf-4514-b3b8-22a3df7935ef/addSubTask')
      .send({ subTaskId: 'abc' });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Invalid Task ID');
  });

  test('Adding a Sub Task should return 400 error when Sub Task id is not known', async () => {
    const res = await request(app).put('/tasks/51c47413-6adf-4514-b3b8-22a3df7935ef/addSubTask')
      .send({ subTaskId: "fd8aea26-cf57-43b0-9427-4c156f3d38e6" });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Task not found');
  });

  test('Adding a Sub Task should return 200 error when ids are known', async () => {
    const res = await request(app).put('/tasks/51c47413-6adf-4514-b3b8-22a3df7935ef/addSubTask')
      .send({ subTaskId: "594b2fd3-e735-44df-969e-a2d0e49c208d" });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('SubTask successfully added to Task');

    const getRes = await request(app).get('/tasks/51c47413-6adf-4514-b3b8-22a3df7935ef');
    expect(getRes.body.subTasks.some(
      (subTask) => subTask.id === "594b2fd3-e735-44df-969e-a2d0e49c208d"
    )).toBeTruthy();
  });
});
