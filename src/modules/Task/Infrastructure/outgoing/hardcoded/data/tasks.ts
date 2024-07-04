export interface RawTask {
  id: number;
  description: string;
  status: RawTaskStatus;
  subTasks?: RawTask[];
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
    subTasks: [
      {
        id: 101,
        description: "Get a Loan",
        status: RawTaskStatus.InProgress,
      },
      {
        id: 102,
        description: "Buy furniture",
        status: RawTaskStatus.ToDo,
      },
      {
        id: 103,
        description: "Wait until house is (almost) finished",
        status: RawTaskStatus.WaitingForStart,
      }
    ],
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
