import { AggregateSnapshot } from '../../../../src/core/Domain/AggregateSnapshot';
import { Task, TaskProps } from '../../../../src/modules/Task/Domain/Task';
import { TaskStatusFactory } from '../../../../src/modules/Task/Domain/Task/TaskStatus/TaskStatusFactory';
import { RawTaskStatus } from '../../../../src/modules/Task/Infrastructure/outgoing/hardcoded/data/tasks';
import { TaskDescription } from '../../../../src/modules/Task/Vocabulary/TaskDescription';
import { TaskId } from '../../../../src/modules/Task/Vocabulary/TaskId';

describe('Complete task', () => {
  test('completing a task in status To Do should update the status to Done', async () => {
    const task = getTask(RawTaskStatus.ToDo);
    const result = task.complete();
    expect(result.isFailure).toBeFalsy();
    expect(task.toSnapshot().props.status.getRaw()).toBe(RawTaskStatus.Done);
  });

  test('completing a task in status In Progress should update the status to Done', async () => {
    const task = getTask(RawTaskStatus.InProgress);
    const result = task.complete();
    expect(result.isFailure).toBeFalsy();
    expect(task.toSnapshot().props.status.getRaw()).toBe(RawTaskStatus.Done);
  });

  test('completing a task in status Waiting for Start should fail', async () => {
    const task = getTask(RawTaskStatus.WaitingForStart);
    const result = task.complete();
    expect(result.isFailure).toBeTruthy();
    expect(result.getErrors()).toContain('A Task with Status Waiting for Start cannot be completed');
    expect(task.toSnapshot().props.status.getRaw()).toBe(RawTaskStatus.WaitingForStart);
  });

  test('completing a task in status Done should fail', async () => {
    const task = getTask(RawTaskStatus.Done);
    const result = task.complete();
    expect(result.isFailure).toBeTruthy();
    expect(result.getErrors()).toContain('A Task with Status Done cannot be completed');
    expect(task.toSnapshot().props.status.getRaw()).toBe(RawTaskStatus.Done);
  });

  test('completing a task with completed subTasks should update the status to Done', async () => {
    const task = getTask(
      RawTaskStatus.InProgress,
      { subTasks: [
        Task.fromSnapshot(new AggregateSnapshot<TaskProps>({
          id: TaskId.create(999123).getValue(),
          description: TaskDescription.create("Sub Task 1").getValue(),
          status: TaskStatusFactory.create(RawTaskStatus.Done).getValue(),
        })),
        Task.fromSnapshot(new AggregateSnapshot<TaskProps>({
          id: TaskId.create(999124).getValue(),
          description: TaskDescription.create("Sub Task 2").getValue(),
          status: TaskStatusFactory.create(RawTaskStatus.Done).getValue(),
        })),
      ] }
    );

    const result = task.complete();
    expect(result.isFailure).toBeFalsy();
    expect(task.toSnapshot().props.status.getRaw()).toBe(RawTaskStatus.Done);
  });

  test('completing a task with an incomplete subTask should fail', async () => {
    const task = getTask(
      RawTaskStatus.InProgress,
      { subTasks: [
        Task.fromSnapshot(new AggregateSnapshot<TaskProps>({
          id: TaskId.create(999123).getValue(),
          description: TaskDescription.create("Sub Task 1").getValue(),
          status: TaskStatusFactory.create(RawTaskStatus.Done).getValue(),
        })),
        Task.fromSnapshot(new AggregateSnapshot<TaskProps>({
          id: TaskId.create(999124).getValue(),
          description: TaskDescription.create("Sub Task 2").getValue(),
          status: TaskStatusFactory.create(RawTaskStatus.ToDo).getValue(),
        })),
      ] }
    );

    const result = task.complete();
    expect(result.isFailure).toBeTruthy();
    expect(result.getErrors()).toContain('Cannot complete a Task with unfinished subtasks');
    expect(task.toSnapshot().props.status.getRaw()).toBe(RawTaskStatus.InProgress);
  });

  test('completing a task with an incomplete optional subTask should update the status to Done', async () => {
    const task = getTask(
      RawTaskStatus.InProgress,
      { subTasks: [
        Task.fromSnapshot(new AggregateSnapshot<TaskProps>({
          id: TaskId.create(999123).getValue(),
          description: TaskDescription.create("Sub Task 1").getValue(),
          status: TaskStatusFactory.create(RawTaskStatus.ToDo).getValue(),
          optional: true,
        })),
      ] }
    );

    const result = task.complete();
    expect(result.isFailure).toBeFalsy();
    expect(task.toSnapshot().props.status.getRaw()).toBe(RawTaskStatus.Done);
  });
});

const getTask = (status: RawTaskStatus, otherProps?: Partial<TaskProps>): Task => {
  const taskProps: TaskProps = {
    ...otherProps,
    description: TaskDescription.create("Test").getValue(),
    status: TaskStatusFactory.create(status).getValue(),
  };
  const taskSnapshot = new AggregateSnapshot<TaskProps>(taskProps);
  return Task.fromSnapshot(taskSnapshot);
}
