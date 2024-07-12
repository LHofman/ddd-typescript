import { AggregateSnapshot } from '../../../../src/core/Domain/AggregateSnapshot';
import { Task, TaskProps } from '../../../../src/modules/Task/Domain/Task';
import { TaskStatusFactory } from '../../../../src/modules/Task/Domain/Task/TaskStatus/TaskStatusFactory';
import { RawTaskStatus } from '../../../../src/modules/Task/Infrastructure/outgoing/hardcoded/data/tasks';
import { TaskDescription } from '../../../../src/modules/Task/Vocabulary/TaskDescription';

describe('Add Subtask', () => {
  test('adding a subtask should work', async () => {
    const task = getTask(RawTaskStatus.InProgress);
    const subTask = Task.create({ description: TaskDescription.create("Sub Task").getValue() }).getValue();
    const result = task.addSubTask(subTask);
    expect(result.isFailure).toBeFalsy();

    const subTasks = task.toSnapshot().props.subTasks;
    expect(subTasks).toHaveLength(1);
    expect(subTasks[0].toSnapshot().props.description.getDescription()).toBe("Sub Task");
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
