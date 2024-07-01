import { Result } from '../../../../../../core/Logic/Result';
import { Task } from '../../../../Domain/Task';
import { CreateTaskCommandDTO } from './CreateTaskCommandDTO';

export interface ICreateTaskCommandHandler {
  handle(command: CreateTaskCommandDTO): Promise<Result<Task>>;
}
