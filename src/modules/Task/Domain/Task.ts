import { Result } from '../../../core/Logic/Result';
import { AggregateRoot } from '../../../core/Domain/AggregateRoot';
import { TaskDescription } from '../Vocabulary/TaskDescription';
import { TaskId } from '../Vocabulary/TaskId';
import { AggregateSnapshot } from '../../../core/Domain/AggregateSnapshot';
import { TaskStatus } from './Task/TaskStatus/TaskStatus';
import { ToDo } from './Task/TaskStatus/ToDo';

export interface TaskProps {
  id?: TaskId;
  description: TaskDescription;
  status: TaskStatus;
  subTasks?: TaskProps[];
}

export interface CreateTaskProps {
  description: TaskDescription;
}

export interface UpdateTaskProps {
  description?: TaskDescription;
}

export class Task extends AggregateRoot<TaskProps> {
  private constructor(props: TaskProps) {
    super(props);
  }

  public static fromSnapshot(snapshot: AggregateSnapshot<TaskProps>): Task {
    return new Task(snapshot.props);
  }

  public toSnapshot(): AggregateSnapshot<TaskProps> {
    return new AggregateSnapshot<TaskProps>(this.props);
  }

  public static create(props: CreateTaskProps): Result<Task> {
    const task = new Task({
      ...props,
      status: new ToDo(),
    });

    return Result.ok(task);
  }

  public update(props: UpdateTaskProps): Result<void> {
    this.props.description = props.description;

    return Result.ok();
  }

  public start(): Result<void> {
    return this.updateStatus((status) => status.start());
  }

  public complete(): Result<void> {
    const hasUnfinishedSubtasks = this.props.subTasks?.some((subTask) => !subTask.status.isFinished());
    if (hasUnfinishedSubtasks) {
      return Result.fail('Cannot complete a Task with unfinished subtasks');  
    }

    return this.updateStatus((status) => status.complete());
  }

  private updateStatus(callback: (TaskStatus) => Result<TaskStatus>): Result<void> {
    const statusResult = callback(this.props.status);
    if (statusResult.isFailure) {
      return Result.fail(statusResult.getErrors());
    }

    this.props.status = statusResult.getValue();

    return Result.ok();
  }
}
