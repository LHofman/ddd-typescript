import { Result } from '../../../../../core/Logic/Result';
import { Task } from '../../../Domain/Task';
import { ITaskRepository } from '../../../Domain/Repository/ITaskRepository';
import { TaskDescription } from '../../../Vocabulary/TaskDescription';
import { CreateTaskCommandDTO } from '../../Port/Command/CreateTask/CreateTaskCommandDTO';
import { ICreateTaskCommandHandler } from '../../Port/Command/CreateTask/ICreateTaskCommandHandler';

export class CreateTaskCommandHandler implements ICreateTaskCommandHandler {
  constructor(private taskRepository: ITaskRepository) {}
  
  public async handle(command: CreateTaskCommandDTO): Promise<Result<Task>> {
    const descriptionOrError = TaskDescription.create(command.description);
    if (descriptionOrError.isFailure) {
      return Result.fail<Task>(descriptionOrError.getErrors());
    }
    const description = descriptionOrError.getValue();

    const taskOrError = Task.create({ description });
    if (taskOrError.isFailure) {
      return Result.fail<Task>(taskOrError.getErrors());
    }
    let task = taskOrError.getValue();

    task = await this.taskRepository.save(task);

    return Result.ok(task);
  }
}
