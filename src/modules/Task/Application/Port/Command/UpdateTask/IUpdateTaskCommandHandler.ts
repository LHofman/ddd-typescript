import { Result } from '../../../../../../core/Logic/Result';
import { UpdateTaskCommandDTO } from './UpdateTaskCommandDTO';

export interface IUpdateTaskCommandHandler {
  handle(command: UpdateTaskCommandDTO): Promise<Result<void>>;

  start(id: string): Promise<Result<void>>;
}
