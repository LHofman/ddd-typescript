import { Result } from '../../../../../core/Logic/Result';
import { Task } from '../../../Domain/Task';
import { ITaskRepository } from '../../../Domain/Repository/ITaskRepository';
import { TaskDescription } from '../../../Vocabulary/TaskDescription';
import { CreateTaskCommandDTO } from '../../Port/Command/CreateTask/CreateTaskCommandDTO';
import { ICreateTaskCommandHandler } from '../../Port/Command/CreateTask/ICreateTaskCommandHandler';

export class CreateTaskCommandHandler implements ICreateTaskCommandHandler {
  constructor(private taskRepository: ITaskRepository) {}
  
  public async handle(command: CreateTaskCommandDTO): Promise<Result<Task>> {
    return TaskDescription.create(command.description)
      .onSuccess((description) => Task.create({ description }))
      .onSuccessAsync(this.taskRepository.save.bind(this.taskRepository));
  }
}
