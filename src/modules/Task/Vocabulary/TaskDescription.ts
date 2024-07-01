import { Result } from '../../../core/Logic/Result';

export class TaskDescription {
  private readonly description: string;

  private constructor(description: string) {
    this.description = description;
  }

  public static create(description: string): Result<TaskDescription> {
    return Result.ok<TaskDescription>(new TaskDescription(description));
  }

  public getDescription(): string {
    return this.description;
  }
}
