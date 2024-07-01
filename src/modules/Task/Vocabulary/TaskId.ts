import { Result } from '../../../core/Logic/Result';

export class TaskId {
  private readonly id: number;

  private constructor(id: number) {
    this.id = id;
  }

  public static create(id: number): Result<TaskId> {
    if (id < 1) {
      return Result.fail<TaskId>('Task Id must be greater than 0');
    }

    return Result.ok<TaskId>(new TaskId(id));
  }

  public getId(): number {
    return this.id;
  }
}
