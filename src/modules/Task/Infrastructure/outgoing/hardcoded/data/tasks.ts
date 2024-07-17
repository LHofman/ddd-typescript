export interface RawTask {
  id: number;
  description: string;
  status: RawTaskStatus;
  parentId?: number;
  optional?: boolean;
}

export enum RawTaskStatus {
  ToDo = "To Do",
  InProgress = "In Progress",
  WaitingForStart = "Waiting for Start",
  Done = "Done",
}

export const tasksData: RawTask[] = [
  {
    id: 1,
    description: "Build House",
    status: RawTaskStatus.InProgress,
  },
  {
    id: 101,
    description: "Get a Loan",
    status: RawTaskStatus.Done,
    parentId: 1,
  },
  {
    id: 102,
    description: "Buy furniture",
    status: RawTaskStatus.ToDo,
    parentId: 1,
    optional: true,
  },
  {
    id: 103,
    description: "Wait until house is (almost) finished",
    status: RawTaskStatus.WaitingForStart,
    parentId: 1,
  },
  {
    id: 2,
    description: "Watch Criminal Minds",
    status: RawTaskStatus.InProgress,
  },
  {
    id: 3,
    description: "Watch Deadpool and Wolverine",
    status: RawTaskStatus.WaitingForStart,
  },
  {
    id: 4,
    description: "Get a Haircut",
    status: RawTaskStatus.ToDo,
  },
];
