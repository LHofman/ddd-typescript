import { Result } from '../../../../../../core/Logic/Result';
import { AddSubTaskCommandDTO } from './AddSubTaskCommandDTO';

export interface IAddSubTaskCommandHandler {
  handle(command: AddSubTaskCommandDTO): Promise<Result<void>>;
}
