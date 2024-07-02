import { Result } from '../../../../../../core/Logic/Result';
import { Task } from '../../../../Domain/Task';
import { TaskStatus } from '../../../../Domain/Task/TaskStatus/TaskStatus';
import { UpdateTaskCommandDTO } from './UpdateTaskCommandDTO';

export interface IUpdateTaskCommandHandler {
  handle(command: UpdateTaskCommandDTO): Promise<Result<void>>;

  start(id: number): Promise<Result<void>>;
}
