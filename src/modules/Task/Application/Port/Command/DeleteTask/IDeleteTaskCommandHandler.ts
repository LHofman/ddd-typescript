import { Result } from '../../../../../../core/Logic/Result';
import { DeleteTaskCommandDTO } from './DeleteTaskCommandDTO';

export interface IDeleteTaskCommandHandler {
  handle(command: DeleteTaskCommandDTO): Promise<Result<void>>;
}
