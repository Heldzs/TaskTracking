import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Tasklist } from '../../interfaces/tasklist';

@Component({
  selector: 'app-tasklist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasklist.html',
  styleUrl: './tasklist.css',
})
export class TasklistComponent {
  private http = inject(HttpClient);

  tasklists: Tasklist[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.http
      .get<Tasklist[]>('http://localhost:8000/api/tasklists/')
      .subscribe({
        next: (data) => {
          this.tasklists = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar blocos de tarefas.';
          this.loading = false;
        },
      });
  }
}
