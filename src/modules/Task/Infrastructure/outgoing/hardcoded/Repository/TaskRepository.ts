import { Result } from '../../../../../../core/Logic/Result';
import { Maybe } from '../../../../../../types';
import { Task, TaskProps } from '../../../../Domain/Task';
import { ITaskRepository } from '../../../../Domain/Repository/ITaskRepository';
import { TaskDescription } from '../../../../Vocabulary/TaskDescription';
import { TaskId } from '../../../../Vocabulary/TaskId';
import { RawTask, tasksData } from '../data/tasks';
import { AggregateSnapshot } from '../../../../../../core/Domain/AggregateSnapshot';
import { TaskStatusFactory } from '../../../../Domain/Task/TaskStatus/TaskStatusFactory';

export class TaskRepository implements ITaskRepository {
  public async getTaskById(taskId: TaskId): Promise<Maybe<Task>> {
    const taskData = tasksData.find(j => j.id === taskId.getId());
    if (!taskData) {
      return null;
    }

    return this.mapDataToTask(taskData);
  }
  
  public async save(task: Task): Promise<Task> {
    const taskProps = task.toSnapshot().props;

    if (taskProps.id && await this.exists(taskProps.id)) {
      const taskIndex = tasksData.findIndex(j => j.id === taskProps.id?.getId());
      tasksData[taskIndex] = this.mapTaskToData(task);

      return this.mapDataToTask(tasksData[taskIndex]);
    }

    const highestId = tasksData.reduce((acc, curr) => curr.id > acc ? curr.id : acc, 0);
    const newTaskId = highestId + 1;

    tasksData.push({
      ...this.mapTaskToData(task),
      id: newTaskId,
    });

    return this.mapDataToTask(tasksData.find(j => j.id === newTaskId));
  }

  public async deleteTaskById(taskId: TaskId): Promise<Result<null>> {
    if (!await this.exists(taskId)) {
      return Result.fail<null>('Task not found');
    }

    tasksData.splice(tasksData.findIndex(j => j.id === taskId.getId()), 1);

    return Result.ok(null);
  }

  private async exists(taskId: TaskId): Promise<boolean> {
    return tasksData.some(j => j.id === taskId.getId());
  }

  private mapTaskToData(task: Task): RawTask {
    const taskProps = task.toSnapshot().props;
    return {
      id: taskProps.id?.getId(),
      description: taskProps.description.getDescription(),
      status: taskProps.status.getRaw(),
    };
  }

  private mapDataToTask(data: RawTask): Task {
    const taskProps: TaskProps = {
      id: TaskId.create(data.id).getValue(),
      description: TaskDescription.create(data.description).getValue(),
      status: TaskStatusFactory.create(data.status).getValue(),
    };
    const taskSnapshot = new AggregateSnapshot<TaskProps>(taskProps);
    return Task.fromSnapshot(taskSnapshot);
  }
}
