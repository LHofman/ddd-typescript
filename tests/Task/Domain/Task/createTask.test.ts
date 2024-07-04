import { Task } from '../../../../src/modules/Task/Domain/Task';
import { TaskDescription } from '../../../../src/modules/Task/Vocabulary/TaskDescription';

describe('Create task', () => {
  test('creating a task with all props should return a valid task', async () => {
    const taskResult = Task.create({ description: TaskDescription.create("Test").getValue() });

    expect(taskResult.isFailure).toBeFalsy();
    expect(taskResult.getValue()).toBeInstanceOf(Task);
    
    const task = taskResult.getValue();
    const taskSnapshot = task.toSnapshot();
    expect(taskSnapshot.props.description.getDescription()).toBe("Test");
  });

  test('creating a task, the stauts should be To Do', async () => {
    const taskResult = Task.create({ description: TaskDescription.create("Test").getValue() });

    const task = taskResult.getValue();
    const taskSnapshot = task.toSnapshot();

    expect(taskSnapshot.props.status.getRaw()).toBe("To Do");
  });
});
