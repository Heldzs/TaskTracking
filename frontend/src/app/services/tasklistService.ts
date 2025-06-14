import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tasklist } from '../interfaces/tasklist';

@Injectable({
  providedIn: 'root'
})
export class TasklistService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/tasklists/';

  getTasklists(): Observable<Tasklist[]> {
    return this.http.get<Tasklist[]>(this.apiUrl);
  }

  getTasklist(id: number): Observable<Tasklist> {
    return this.http.get<Tasklist>(`${this.apiUrl}${id}/`);
  }

  createTasklist(tasklist: Tasklist): Observable<Tasklist> {
    return this.http.post<Tasklist>(this.apiUrl, tasklist);
  }

  updateTasklist(id: number, tasklist: Tasklist): Observable<Tasklist> {
    return this.http.put<Tasklist>(`${this.apiUrl}${id}/`, tasklist);
  }

  deleteTasklist(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}
