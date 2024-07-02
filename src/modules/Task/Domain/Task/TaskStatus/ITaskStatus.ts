import { RawTaskStatus } from "../../../Infrastructure/outgoing/hardcoded/data/tasks";

export interface ITaskStatus {
  getRaw(): RawTaskStatus;
}
