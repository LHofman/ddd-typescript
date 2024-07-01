import { Result } from '../../../../../../core/Logic/Result';
import { Task } from '../../../../Domain/Task';
import { UpdateTaskCommandDTO } from './UpdateTaskCommandDTO';

export interface IUpdateTaskCommandHandler {
  handle(command: UpdateTaskCommandDTO): Promise<Result<Task>>;
}
