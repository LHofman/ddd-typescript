import { Result } from '../../../../../../core/Logic/Result';
import { Maybe } from '../../../../../../types';
import { Task } from '../../../../Domain/Task';
import { ITaskRepository } from '../../../../Domain/Repository/ITaskRepository';
import { TaskDescription } from '../../../../Vocabulary/TaskDescription';
import { TaskId } from '../../../../Vocabulary/TaskId';
import { RawTask, tasksData } from '../data/tasks';

export class TaskRepository implements ITaskRepository {
  public async getTaskById(taskId: TaskId): Promise<Maybe<Task>> {
    const taskData = tasksData.find(j => j.id === taskId.getId());
    if (!taskData) {
      return null;
    }

    return this.mapDataToTask(taskData);
  }
  
  public async save(task: Task): Promise<Task> {
    if (task.getId() && await this.exists(task.getId())) {
      const taskIndex = tasksData.findIndex(j => j.id === task.getId()?.getId());
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
    return {
      id: task.getId()?.getId(),
      description: task.getDescription().getDescription(),
    };
  }

  private mapDataToTask(data: RawTask): Task {
    return Task.create({
      id: TaskId.create(data.id).getValue(),
      description: TaskDescription.create(data.description).getValue(),
    }).getValue();
  }
}
