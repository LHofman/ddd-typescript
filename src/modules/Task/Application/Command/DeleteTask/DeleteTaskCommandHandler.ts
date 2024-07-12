import { Result } from '../../../../../core/Logic/Result';
import { ITaskRepository } from '../../../Domain/Repository/ITaskRepository';
import { TaskId } from '../../../Vocabulary/TaskId';
import { DeleteTaskCommandDTO } from '../../Port/Command/DeleteTask/DeleteTaskCommandDTO';
import { IDeleteTaskCommandHandler } from '../../Port/Command/DeleteTask/IDeleteTaskCommandHandler';

export class DeleteTaskCommandHandler implements IDeleteTaskCommandHandler {
  constructor(private taskRepository: ITaskRepository) {}

  public async handle(command: DeleteTaskCommandDTO): Promise<Result<void>> {
    return TaskId.create(command.id)
      .onSuccessAsync(this.taskRepository.deleteTaskById.bind(this.taskRepository));
  }
}
