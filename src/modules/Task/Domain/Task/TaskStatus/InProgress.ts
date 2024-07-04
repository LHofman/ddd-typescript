import { Result } from '../../../../../core/Logic/Result';
import { RawTaskStatus } from "../../../Infrastructure/outgoing/hardcoded/data/tasks";
import { Done } from './Done';
import { TaskStatus } from "./TaskStatus";

export class InProgress extends TaskStatus {
  constructor() {
    super(RawTaskStatus.InProgress);
  }

  public complete(): Result<TaskStatus> {
    return Result.ok(new Done());
  }
}
