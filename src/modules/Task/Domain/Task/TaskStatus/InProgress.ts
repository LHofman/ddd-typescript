import { RawTaskStatus } from "../../../Infrastructure/outgoing/hardcoded/data/tasks";
import { TaskStatus } from "./TaskStatus";

export class InProgress extends TaskStatus {
  constructor() {
    super(RawTaskStatus.InProgress);
  }
}
