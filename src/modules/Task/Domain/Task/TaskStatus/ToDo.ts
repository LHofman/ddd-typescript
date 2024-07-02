import { Result } from "../../../../../core/Logic/Result";
import { RawTaskStatus } from "../../../Infrastructure/outgoing/hardcoded/data/tasks";
import { InProgress } from "./InProgress";
import { TaskStatus } from "./TaskStatus";

export class ToDo extends TaskStatus {
  constructor() {
    super(RawTaskStatus.ToDo);
  }

  public start(): Result<TaskStatus> {
    return Result.ok(new InProgress());
  }
}
