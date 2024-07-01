import { Result } from '../../../../../core/Logic/Result';
import { Task } from '../../../Domain/Task';
import { ITaskRepository } from '../../../Domain/Repository/ITaskRepository';
import { TaskDescription } from '../../../Vocabulary/TaskDescription';
import { TaskId } from '../../../Vocabulary/TaskId';
import { IUpdateTaskCommandHandler } from '../../Port/Command/UpdateTask/IUpdateTaskCommandHandler';
import { UpdateTaskCommandDTO } from '../../Port/Command/UpdateTask/UpdateTaskCommandDTO';

interface TaskProps {
  description?: TaskDescription;
}

export class UpdateTaskCommandHandler implements IUpdateTaskCommandHandler {
  constructor(private taskRepository: ITaskRepository) {}

  public async handle(command: UpdateTaskCommandDTO): Promise<Result<Task>> {
    // Parse Task Id
    const taskIdOrError = TaskId.create(command.id);
    if (taskIdOrError.isFailure) {
      return Result.fail<Task>(taskIdOrError.getErrors());
    }
    const taskId = taskIdOrError.getValue();

    // Fetch Aggregate
    let task = await this.taskRepository.getTaskById(taskId);
    if (!task) {
      return Result.fail<Task>('Task not found');
    }
    
    // Validate Task Props
    const taskPropsOrError = this.validateTaskProps(command);
    if (taskPropsOrError.isFailure) {
      return Result.fail<Task>(taskPropsOrError.getErrors());
    }
    const taskProps = taskPropsOrError.getValue();

    // Update Aggregate
    const result = task.update(taskProps);
    if (result.isFailure) {
      return Result.fail<Task>(result.getErrors());
    }

    task = await this.taskRepository.save(task);

    return Result.ok(task);
  }

  private validateTaskProps(command: UpdateTaskCommandDTO): Result<TaskProps> {
    const props: TaskProps = {};

    if (command.description) {
      const descriptionOrError = TaskDescription.create(command.description);
      if (descriptionOrError.isFailure) {
        return Result.fail<TaskProps>(descriptionOrError.getErrors());
      }
      props.description = descriptionOrError.getValue();
    }

    return Result.ok<TaskProps>(props);
  }
}
