import { Result } from '../../../../core/Logic/Result';
import { Maybe } from '../../../../types';
import { TaskId } from '../../Vocabulary/TaskId';
import { Task } from '../Task';

export interface ITaskRepository {
  getTaskById(taskId: TaskId): Promise<Maybe<Task>>;
  
  save(task: Task): Promise<Task>;

  deleteTaskById(taskId: TaskId): Promise<Result<void>>;
}
