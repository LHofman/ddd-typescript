import { AggregateSnapshot } from '../../../../src/core/Domain/AggregateSnapshot';
import { Task, TaskProps } from '../../../../src/modules/Task/Domain/Task';
import { TaskStatusFactory } from '../../../../src/modules/Task/Domain/Task/TaskStatus/TaskStatusFactory';
import { RawTaskStatus } from '../../../../src/modules/Task/Infrastructure/outgoing/hardcoded/data/tasks';
import { TaskDescription } from '../../../../src/modules/Task/Vocabulary/TaskDescription';

describe('Complete task', () => {
  test('completeing a task in status To Do should update the status to Done', async () => {
    const task = getTask(RawTaskStatus.ToDo);
    const result = task.complete();
    expect(result.isFailure).toBeFalsy();
    expect(task.toSnapshot().props.status.getRaw()).toBe(RawTaskStatus.Done);
  });

  test('completeing a task in status In Progress should update the status to Done', async () => {
    const task = getTask(RawTaskStatus.InProgress);
    const result = task.complete();
    expect(result.isFailure).toBeFalsy();
    expect(task.toSnapshot().props.status.getRaw()).toBe(RawTaskStatus.Done);
  });

  test('completeing a task in status Waiting for Start should fail', async () => {
    const task = getTask(RawTaskStatus.WaitingForStart);
    const result = task.complete();
    expect(result.isFailure).toBeTruthy();
    expect(result.getErrors()).toContain('A Task with Status Waiting for Start cannot be completed');
    expect(task.toSnapshot().props.status.getRaw()).toBe(RawTaskStatus.WaitingForStart);
  });

  test('completeing a task in status Done should fail', async () => {
    const task = getTask(RawTaskStatus.Done);
    const result = task.complete();
    expect(result.isFailure).toBeTruthy();
    expect(result.getErrors()).toContain('A Task with Status Done cannot be completed');
    expect(task.toSnapshot().props.status.getRaw()).toBe(RawTaskStatus.Done);
  });
});

const getTask = (status: RawTaskStatus): Task => {
  const taskProps: TaskProps = {
    description: TaskDescription.create("Test").getValue(),
    status: TaskStatusFactory.create(status).getValue(),
  };
  const taskSnapshot = new AggregateSnapshot<TaskProps>(taskProps);
  return Task.fromSnapshot(taskSnapshot);
}