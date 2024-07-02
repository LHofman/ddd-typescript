import { RawTaskStatus } from "../../../Infrastructure/outgoing/hardcoded/data/tasks";
import { ITaskStatus } from "./ITaskStatus";

export class InProgress implements ITaskStatus {
  getRaw(): RawTaskStatus {
    return RawTaskStatus.InProgress;
  }
}
