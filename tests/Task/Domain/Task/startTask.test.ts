import { AggregateSnapshot } from '../../../../src/core/Domain/AggregateSnapshot';
import { Task, TaskProps } from '../../../../src/modules/Task/Domain/Task';
import { TaskStatusFactory } from '../../../../src/modules/Task/Domain/Task/TaskStatus/TaskStatusFactory';
import { RawTaskStatus } from '../../../../src/modules/Task/Infrastructure/outgoing/hardcoded/data/tasks';
import { TaskDescription } from '../../../../src/modules/Task/Vocabulary/TaskDescription';

describe('Start task', () => {
  test('starting a task in status To Do should update the status to In Progress', async () => {
    const task = getTask(RawTaskStatus.ToDo);
    const result = task.start();
    expect(result.isFailure).toBeFalsy();
    expect(task.toSnapshot().props.status.getRaw()).toBe(RawTaskStatus.InProgress);
  });

  test('starting a task in status In Progress should fail', async () => {
    const task = getTask(RawTaskStatus.InProgress);
    const result = task.start();
    expect(result.isFailure).toBeTruthy();
    expect(result.getErrors()).toContain('A Task with Status In Progress cannot be started');
    expect(task.toSnapshot().props.status.getRaw()).toBe(RawTaskStatus.InProgress);
  });

  test('starting a task in status Waiting for Start should fail', async () => {
    const task = getTask(RawTaskStatus.WaitingForStart);
    const result = task.start();
    expect(result.isFailure).toBeTruthy();
    expect(result.getErrors()).toContain('A Task with Status Waiting for Start cannot be started');
    expect(task.toSnapshot().props.status.getRaw()).toBe(RawTaskStatus.WaitingForStart);
  });

  test('completeing a task in status Done should fail', async () => {
    const task = getTask(RawTaskStatus.Done);
    const result = task.start();
    expect(result.isFailure).toBeTruthy();
    expect(result.getErrors()).toContain('A Task with Status Done cannot be started');
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