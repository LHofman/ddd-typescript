import { Result } from '../../../core/Logic/Result';
import { AggregateRoot } from '../../../core/Domain/AggregateRoot';
import { TaskDescription } from '../Vocabulary/TaskDescription';
import { TaskId } from '../Vocabulary/TaskId';
import { AggregateSnapshot } from '../../../core/Domain/AggregateSnapshot';
import { RawTaskStatus } from '../Infrastructure/outgoing/hardcoded/data/tasks';
import { ITaskStatus } from './Task/TaskStatus/ITaskStatus';
import { ToDo } from './Task/TaskStatus/ToDo';

export interface TaskProps {
  id?: TaskId;
  description: TaskDescription;
  status: ITaskStatus;
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
}
