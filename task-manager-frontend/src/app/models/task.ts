export interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  createdDate: string;
}

export type TaskStatus = 'PENDING' | 'COMPLETED';