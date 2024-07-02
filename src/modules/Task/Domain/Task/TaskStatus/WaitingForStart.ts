import { RawTaskStatus } from "../../../Infrastructure/outgoing/hardcoded/data/tasks";
import { TaskStatus } from "./TaskStatus";

export class WaitingForStart extends TaskStatus {
  constructor() {
    super(RawTaskStatus.WaitingForStart);
  }
}
