import { Result } from '../../../../../core/Logic/Result';
import { Task } from '../../../Domain/Task';
import { ITaskRepository } from '../../../Domain/Repository/ITaskRepository';
import { TaskId } from '../../../Vocabulary/TaskId';
import { IAddSubTaskCommandHandler } from '../../Port/Command/AddSubTask/IAddSubTaskCommandHandler';
import { AddSubTaskCommandDTO } from '../../Port/Command/AddSubTask/AddSubTaskCommandDTO';

export class AddSubTaskCommandHandler implements IAddSubTaskCommandHandler {
  constructor(private taskRepository: ITaskRepository) {}

  public async handle(command: AddSubTaskCommandDTO): Promise<Result<void>> {
    const [taskResult, subTaskResult] = await Promise.all([
      this.getTaskAggregateResult(command.id),
      this.getTaskAggregateResult(command.subTaskId),
    ]);

    const combinedResult = Result.combine(taskResult, subTaskResult);
    if (combinedResult.isFailure) {
      return Result.fail(combinedResult.getErrors());
    }

    const task = taskResult.getValue();
    const subTask = subTaskResult.getValue();

    const result = task.addSubTask(subTask);
    if (result.isFailure) {
      return Result.fail(result.getErrors());
    }

    await this.taskRepository.save(task);

    return Result.ok();
  }

  private async getTaskAggregateResult(id: number): Promise<Result<Task>> {
    return TaskId.create(id)
      .onSuccessAsync((taskId) => this.taskRepository.getTaskById(taskId));
  }
}
