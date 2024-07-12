import { Result } from '../../../../core/Logic/Result';
import { TaskId } from '../../Vocabulary/TaskId';
import { Task } from '../Task';

export interface ITaskRepository {
  getTaskById(taskId: TaskId): Promise<Result<Task>>;
  
  save(task: Task): Promise<Result<Task>>;

  deleteTaskById(taskId: TaskId): Promise<Result<void>>;
}
