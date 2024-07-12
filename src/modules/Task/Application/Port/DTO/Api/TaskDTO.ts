export interface TaskDTO {
  id: number,
  description: string,
  status: string,
  subTasks?: TaskDTO[],
}
