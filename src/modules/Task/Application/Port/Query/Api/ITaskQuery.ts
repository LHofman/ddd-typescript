import { Maybe } from '../../../../../../types';
import { TaskId } from '../../../../Vocabulary/TaskId';
import { TaskDTO } from '../../DTO/Api/TaskDTO';

export interface ITaskQuery {
  findAll(): Promise<TaskDTO[]>;

  findById(id: TaskId): Promise<Maybe<TaskDTO>>;
}
