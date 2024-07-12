import { Result } from '../../../../../core/Logic/Result';
import { ITaskRepository } from '../../../Domain/Repository/ITaskRepository';
import { TaskId } from '../../../Vocabulary/TaskId';
import { DeleteTaskCommandDTO } from '../../Port/Command/DeleteTask/DeleteTaskCommandDTO';
import { IDeleteTaskCommandHandler } from '../../Port/Command/DeleteTask/IDeleteTaskCommandHandler';

export class DeleteTaskCommandHandler implements IDeleteTaskCommandHandler {
  constructor(private taskRepository: ITaskRepository) {}

  public async handle(command: DeleteTaskCommandDTO): Promise<Result<void>> {
    // Parse Task Id
    const taskIdOrError = TaskId.create(command.id);
    if (taskIdOrError.isFailure) {
      return Result.fail<null>(taskIdOrError.getErrors());
    }
    const taskId = taskIdOrError.getValue();

    // Fetch Aggregate
    const deleteResult = await this.taskRepository.deleteTaskById(taskId);
    if (deleteResult.isFailure) {
      return Result.fail<null>(deleteResult.getErrors());
    }

    return Result.ok();
  }
}
