import { validate as uuidValidate } from 'uuid';
import { Result } from '../../../core/Logic/Result';

export class TaskId {
  private readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id: string): Result<TaskId> {
    if (!uuidValidate(id)) {
      return Result.fail("Invalid Task ID");
    }

    return Result.ok<TaskId>(new TaskId(id));
  }

  public getId(): string {
    return this.id;
  }
}
