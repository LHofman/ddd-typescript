import { Maybe } from '../../../../../../types';
import { TaskDTO } from '../../../../Application/Port/DTO/Api/TaskDTO';
import { ITaskQuery } from '../../../../Application/Port/Query/Api/ITaskQuery';
import { TaskId } from '../../../../Vocabulary/TaskId';
import { tasksData } from '../data/tasks';

export class TaskQuery implements ITaskQuery {
  public async findAll(): Promise<TaskDTO[]> {
    return tasksData.map((task) => this.toTaskDTO(task));
  }

  public async findById(id: TaskId): Promise<Maybe<TaskDTO>> {
    const task = tasksData.find((task) => task.id === id.getId());
    if (!task) {
      return null;
    }

    return this.toTaskDTO(task);
  }

  private toTaskDTO(task): TaskDTO {
    return {
      id: task.id,
      description: task.description,
    };
  }
}
