import { RawTaskStatus } from "../../../Infrastructure/outgoing/hardcoded/data/tasks";
import { TaskStatus } from "./TaskStatus";

export class Done extends TaskStatus {
  constructor() {
    super(RawTaskStatus.Done);
  }

  public isFinished = (): boolean => true;
}
