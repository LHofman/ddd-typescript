import { Result } from '../../../../../core/Logic/Result';
import { Task } from '../../../Domain/Task';
import { ITaskRepository } from '../../../Domain/Repository/ITaskRepository';
import { TaskId } from '../../../Vocabulary/TaskId';
import { IAddSubTaskCommandHandler } from '../../Port/Command/AddSubTask/IAddSubTaskCommandHandler';
import { AddSubTaskCommandDTO } from '../../Port/Command/AddSubTask/AddSubTaskCommandDTO';

export class AddSubTaskCommandHandler implements IAddSubTaskCommandHandler {
  constructor(private taskRepository: ITaskRepository) {}

  public async handle(command: AddSubTaskCommandDTO): Promise<Result<void>> {
    const taskResult = await this.getTaskAggregateResult(command.id);
    if (taskResult.isFailure) {
      return Result.fail(taskResult.getErrors());
    }
    let task = taskResult.getValue();
    
    const subTaskResult = await this.getTaskAggregateResult(command.subTaskId);
    if (subTaskResult.isFailure) {
      return Result.fail(subTaskResult.getErrors());
    }
    const subTask = subTaskResult.getValue();
    
    // Update Aggregate
    const result = task.addSubTask(subTask);
    if (result.isFailure) {
      return Result.fail(result.getErrors());
    }

    task = await this.taskRepository.save(task);

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
}
