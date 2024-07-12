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
    const taskPropsOrError = this.validateTaskProps(command);

    const combinedResult = Result.combine(taskResult, taskPropsOrError);
    if (combinedResult.isFailure) {
      return Result.fail(combinedResult.getErrors());
    }

    const task = taskResult.getValue();
    const taskProps = taskPropsOrError.getValue();

    const result = task.update(taskProps);
    if (result.isFailure) {
      return Result.fail(result.getErrors());
    }

    await this.taskRepository.save(task);

    return Result.ok();
  }

  public async start(id: number): Promise<Result<void>> {
    const taskResult = await this.getTaskAggregateResult(id);
    if (taskResult.isFailure) {
      return Result.fail(taskResult.getErrors());
    }
    const task = taskResult.getValue();

    const result = task.start();
    if (result.isFailure) {
      return Result.fail(result.getErrors());
    }
    
    await this.taskRepository.save(task);

    return Result.ok();
  }

  private async getTaskAggregateResult(id: number): Promise<Result<Task>> {
    return TaskId.create(id)
      .onSuccessAsync<Task>(this.taskRepository.getTaskById.bind(this.taskRepository));
  }

  private validateTaskProps(command: UpdateTaskCommandDTO): Result<TaskProps> {
    const props: TaskProps = {};

    if (command.description) {
      const descriptionOrError = TaskDescription.create(command.description);
      if (descriptionOrError.isFailure) {
        return Result.fail(descriptionOrError.getErrors());
      }
      props.description = descriptionOrError.getValue();
    }

    return Result.ok<TaskProps>(props);
  }
}
