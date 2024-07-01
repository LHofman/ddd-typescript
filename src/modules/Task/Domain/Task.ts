import { Result } from '../../../core/Logic/Result';
import { AggregateRoot } from '../../../core/Domain/AggregateRoot';
import { TaskDescription } from '../Vocabulary/TaskDescription';
import { TaskId } from '../Vocabulary/TaskId';

export interface TaskProps {
  id?: TaskId;
  description: TaskDescription;
}

export interface UpdateTaskProps {
  description?: TaskDescription;
}

export class Task extends AggregateRoot<TaskProps> {
  private constructor(props: TaskProps) {
    super(props);
  }

  public getId(): TaskId {
    return this.props.id;
  }

  public getDescription(): TaskDescription {
    return this.props.description;
  }

  public static create(props: TaskProps): Result<Task> {
    const task = new Task(props);

    return Result.ok(task);
  }

  public update(props: UpdateTaskProps): Result<void> {
    this.props.description = props.description;

    return Result.ok();
  }
}
