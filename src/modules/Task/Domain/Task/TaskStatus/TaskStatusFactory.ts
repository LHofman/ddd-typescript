import { Result } from "../../../../../core/Logic/Result";
import { RawTaskStatus } from "../../../Infrastructure/outgoing/hardcoded/data/tasks";
import { ITaskStatus } from "./ITaskStatus";
import { InProgress } from "./InProgress";
import { ToDo } from "./ToDo";
import { WaitingForStart } from "./WaitingForStart";

export class TaskStatusFactory {
  public static create(rawTaskStatus: RawTaskStatus): Result<ITaskStatus> {
    switch (rawTaskStatus) {
      case RawTaskStatus.ToDo: return Result.ok(new ToDo());
      case RawTaskStatus.InProgress: return Result.ok(new InProgress());
      case RawTaskStatus.WaitingForStart: return Result.ok(new WaitingForStart());
      default: return Result.fail(`Unknown Task Status ${rawTaskStatus}`);
    }
  }
}
