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
      tasksData[taskIndex] = this.mapTaskPropsToData(taskProps);

      this.saveSubTasks(taskProps.subTasks, taskProps.id);

      return this.mapDataToTask(tasksData[taskIndex]);
    }

    const highestId = tasksData.reduce((acc, curr) => curr.id > acc ? curr.id : acc, 0);
    const newTaskId = highestId + 1;

    tasksData.push({
      ...this.mapTaskPropsToData(taskProps),
      id: newTaskId,
    });

    this.saveSubTasks(taskProps.subTasks, TaskId.create(newTaskId).getValue());

    return this.mapDataToTask(tasksData.find(j => j.id === newTaskId));
  }

  private async saveSubTasks(subTasks: Task[], parentId: TaskId): Promise<void> {
    if (!subTasks) return;
    
    subTasks.forEach((subTask) => {
      const subTaskIndex = tasksData.findIndex((task) => task.id === subTask.toSnapshot().props.id.getId());
      tasksData[subTaskIndex].parentId = parentId.getId();
    });
  }

  public async deleteTaskById(taskId: TaskId): Promise<Result<void>> {
    if (!await this.exists(taskId)) {
      return Result.fail<null>('Task not found');
    }

    tasksData.splice(tasksData.findIndex(j => j.id === taskId.getId()), 1);

    return Result.ok();
  }

  private async exists(taskId: TaskId): Promise<boolean> {
    return tasksData.some(j => j.id === taskId.getId());
  }

  private mapTaskPropsToData = (taskProps: TaskProps): RawTask => ({
    id: taskProps.id?.getId(),
    description: taskProps.description.getDescription(),
    status: taskProps.status.getRaw(),
  });

  private mapDataToTask(data: RawTask): Task {
    const taskProps = this.mapDataToTaskProps(data);

    const subTasks = tasksData
      .filter((task) => task.parentId === taskProps.id.getId());
    if (subTasks.length) {
      taskProps.subTasks = subTasks.map((task) => this.mapDataToTask(task));
    }

    const taskSnapshot = new AggregateSnapshot<TaskProps>(taskProps);
    return Task.fromSnapshot(taskSnapshot);
  }

  private mapDataToTaskProps = (data: RawTask): TaskProps => ({
    id: TaskId.create(data.id).getValue(),
    description: TaskDescription.create(data.description).getValue(),
    status: TaskStatusFactory.create(data.status).getValue(),
  });
}
