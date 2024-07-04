import { Result } from "../../../../../core/Logic/Result";
import { RawTaskStatus } from "../../../Infrastructure/outgoing/hardcoded/data/tasks";

export abstract class TaskStatus {
  protected constructor(protected rawStatus: RawTaskStatus) {}

  public getRaw = (): RawTaskStatus => this.rawStatus;

  public isFinished = (): boolean => false;

  public start = (): Result<TaskStatus> => Result.fail(`A Task with Status ${this.rawStatus} cannot be started`);
  public complete = (): Result<TaskStatus> => Result.fail(`A Task with Status ${this.rawStatus} cannot be completed`);
}
