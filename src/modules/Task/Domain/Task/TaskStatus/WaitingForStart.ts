import { RawTaskStatus } from "../../../Infrastructure/outgoing/hardcoded/data/tasks";
import { ITaskStatus } from "./ITaskStatus";

export class WaitingForStart implements ITaskStatus {
  getRaw(): RawTaskStatus {
    return RawTaskStatus.WaitingForStart;
  }
}
