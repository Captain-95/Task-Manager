import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Task } from '../../models/task';
import { TaskRequest } from '../../models/task-request';
import { TaskFilter } from '../../models/task-filter';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private http = inject(HttpClient);

  private readonly API = `${environment.apiUrl}/tasks`;

  getAllTasks(): Observable<Task[]> {

    return this.http.get<Task[]>(this.API);

  }
  searchTasks(filter: TaskFilter) {

    return this.http.post<Task[]>(
      `${this.API}/search`,
      filter
    );

  }

  createTask(request: TaskRequest): Observable<Task> {

    return this.http.post<Task>(this.API, request);

  }

  updateTask(id: string, request: TaskRequest): Observable<Task> {

  return this.http.put<Task>(
    `${this.API}/${id}`,
    request
  );

  }

  deleteTask(id: string): Observable<void> {

    return this.http.delete<void>(
      `${this.API}/${id}`
    );

  }

  updateTaskStatus(id: string, status: string): Observable<Task> {

  return this.http.put<Task>(
    `${this.API}/${id}/status`,
    {
      status
    }
  );

}


}