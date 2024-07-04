import { Result } from "../../../../../core/Logic/Result";
import { RawTaskStatus } from "../../../Infrastructure/outgoing/hardcoded/data/tasks";
import { TaskStatus } from "./TaskStatus";
import { InProgress } from "./InProgress";
import { ToDo } from "./ToDo";
import { WaitingForStart } from "./WaitingForStart";
import { Done } from './Done';

export class TaskStatusFactory {
  public static create(rawTaskStatus: RawTaskStatus): Result<TaskStatus> {
    switch (rawTaskStatus) {
      case RawTaskStatus.Done: return Result.ok(new Done());
      case RawTaskStatus.InProgress: return Result.ok(new InProgress());
      case RawTaskStatus.ToDo: return Result.ok(new ToDo());
      case RawTaskStatus.WaitingForStart: return Result.ok(new WaitingForStart());
      default: return Result.fail(`Unknown Task Status ${rawTaskStatus}`);
    }
  }
}
