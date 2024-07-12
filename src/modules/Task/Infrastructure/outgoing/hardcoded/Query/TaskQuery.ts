import { Maybe } from '../../../../../../types';
import { TaskDTO } from '../../../../Application/Port/DTO/Api/TaskDTO';
import { ITaskQuery } from '../../../../Application/Port/Query/Api/ITaskQuery';
import { TaskId } from '../../../../Vocabulary/TaskId';
import { RawTask, tasksData } from '../data/tasks';

export class TaskQuery implements ITaskQuery {
  public async findAll(): Promise<TaskDTO[]> {
    const taskDTOs = tasksData.map((task) => this.toTaskDTO(task));

    taskDTOs.forEach((taskDTO) => this.populateWithSubTasks(taskDTO));

    return taskDTOs;
  }

  public async findById(id: TaskId): Promise<Maybe<TaskDTO>> {
    const task = tasksData.find((task) => task.id === id.getId());
    if (!task) {
      return null;
    }

    const taskDTO = this.toTaskDTO(task);

    this.populateWithSubTasks(taskDTO);

    return taskDTO;
  }

  private populateWithSubTasks(taskDTO: TaskDTO): void {
    const subTasks = tasksData
      .filter((task) => task.parentId === taskDTO.id)
      .map((task) => this.toTaskDTO(task));
    if (!subTasks.length) {
      return;
    }

    subTasks.forEach((subTask) => this.populateWithSubTasks(subTask));

    taskDTO.subTasks = subTasks;
  }

  private toTaskDTO(task: RawTask): TaskDTO {
    return {
      id: task.id,
      description: task.description,
      status: task.status,
    };
  }
}
