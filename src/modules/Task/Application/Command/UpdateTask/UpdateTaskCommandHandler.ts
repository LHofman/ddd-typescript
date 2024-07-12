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

  public async handle(command: UpdateTaskCommandDTO): Promise<Result<void>> {
    const taskResult = await this.getTaskAggregateResult(command.id);
    if (taskResult.isFailure) {
      return Result.fail(taskResult.getErrors());
    }
    let task = taskResult.getValue();
    
    // Validate Task Props
    const taskPropsOrError = this.validateTaskProps(command);
    if (taskPropsOrError.isFailure) {
      return Result.fail(taskPropsOrError.getErrors());
    }
    const taskProps = taskPropsOrError.getValue();

    // Update Aggregate
    const result = task.update(taskProps);
    if (result.isFailure) {
      return Result.fail(result.getErrors());
    }

    task = await this.taskRepository.save(task);

    return Result.ok();
  }

  public async start(id: number): Promise<Result<void>> {
    const taskResult = await this.getTaskAggregateResult(id);
    if (taskResult.isFailure) {
      return Result.fail(taskResult.getErrors());
    }
    const task = taskResult.getValue();
    
    // Update Aggregate
    const result = task.start();
    if (result.isFailure) {
      return Result.fail(result.getErrors());
    }

    await this.taskRepository.save(task);

    return Result.ok();
  }

  private async getTaskAggregateResult(id: number): Promise<Result<Task>> {
    // Parse Task Id
    const taskIdOrError = TaskId.create(id);
    if (taskIdOrError.isFailure) {
      return Result.fail<Task>(taskIdOrError.getErrors());
    }
    const taskId = taskIdOrError.getValue();

    // Fetch Aggregate
    const task = await this.taskRepository.getTaskById(taskId);
    if (!task) {
      return Result.fail<Task>('Task not found');
    }

    return Result.ok<Task>(task);
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
