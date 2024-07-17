export interface RawTask {
  id: string;
  description: string;
  status: RawTaskStatus;
  parentId?: string;
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
    id: "51c47413-6adf-4514-b3b8-22a3df7935ef",
    description: "Build House",
    status: RawTaskStatus.InProgress,
  },
  {
    id: "51945846-a2a4-494e-a7cd-43e5d391a93b",
    description: "Get a Loan",
    status: RawTaskStatus.Done,
    parentId: "51c47413-6adf-4514-b3b8-22a3df7935ef",
  },
  {
    id: "35a45caa-db9b-4a24-9a7c-8e5cad2abfb7",
    description: "Buy furniture",
    status: RawTaskStatus.ToDo,
    parentId: "51c47413-6adf-4514-b3b8-22a3df7935ef",
    optional: true,
  },
  {
    id: "43fa4414-7d45-432e-9bb0-17d1cda53920",
    description: "Wait until house is (almost) finished",
    status: RawTaskStatus.WaitingForStart,
    parentId: "51c47413-6adf-4514-b3b8-22a3df7935ef",
  },
  {
    id: "594b2fd3-e735-44df-969e-a2d0e49c208d",
    description: "Watch Criminal Minds",
    status: RawTaskStatus.InProgress,
  },
  {
    id: "b6433a4d-5048-4cee-a484-2a85d6019549",
    description: "Watch Deadpool and Wolverine",
    status: RawTaskStatus.WaitingForStart,
  },
  {
    id: "8ddca6c9-10f2-4f65-aae5-994efe25bef2",
    description: "Get a Haircut",
    status: RawTaskStatus.ToDo,
  },
];
