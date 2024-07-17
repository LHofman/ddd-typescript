export interface TaskDTO {
  id: string,
  description: string,
  status: string,
  subTasks?: TaskDTO[],
}
