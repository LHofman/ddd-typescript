import { RawTaskStatus } from "../../../Infrastructure/outgoing/hardcoded/data/tasks";
import { ITaskStatus } from "./ITaskStatus";

export class ToDo implements ITaskStatus {
  getRaw(): RawTaskStatus {
    return RawTaskStatus.ToDo;
  }
}
