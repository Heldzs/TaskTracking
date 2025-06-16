import { Component, OnInit, inject } from '@angular/core'; // Importar 'inject'
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms'; // Módulos de formulário

import { TaskService} from '../../services/tasklistService'; // Ajuste o caminho do serviço
import { AuthService } from '../../services/auth.service'; // Para logout
import { Tasklist, Task } from '../../interfaces/tasklist';

@Component({
  selector: 'app-tasklist',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tasklist.html',
  styleUrls: ['./tasklist.css'],
})
export class TasklistComponent implements OnInit {
  // Usando a função inject() para obter as dependências
  taskService = inject(TaskService);
  authService = inject(AuthService);

  taskLists: Tasklist[] = [];
  selectedTaskList: Tasklist | null = null;
  editingTask: Task | null = null;
  editingTaskList: Tasklist | null = null;

  tasklistForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    category: new FormControl(''),
    priority: new FormControl(''),
    deadline: new FormControl(''),
  });

  constructor() {} // O construtor pode ficar vazio ou ser removido se não houver lógica nele

  ngOnInit(): void {
    this.loadTaskLists();
  }

  onLogout(): void {
    this.authService.logout();
    alert('Logout realizado.');
    // No app.component.ts, o pai irá reagir a essa mudança de estado
  }

  loadTaskLists(): void {
    this.taskService.getTaskLists().subscribe(
      (data) => {
        this.taskLists = data;
      },
      (error) => {
        console.error('Erro ao carregar TaskLists:', error);
      }
    );
  }

  onAddOrUpdateTaskList(): void {
    if (this.tasklistForm.valid) {
      const newTaskList: Tasklist = {
        title: this.tasklistForm.value.name || '',
      };
      if (this.editingTaskList) {
        this.taskService
          .updateTaskList(this.editingTaskList.id!, newTaskList)
          .subscribe(
            () => {
              alert('TaskList atualizada!');
              this.loadTaskLists();
              this.resetTaskListForm();
            },
            (error) => {
              console.error('Erro ao atualizar TaskList:', error);
              alert('Erro ao atualizar TaskList.');
            }
          );
      } else {
        this.taskService.createTaskList(newTaskList).subscribe(
          () => {
            alert('TaskList criada!');
            this.loadTaskLists();
            this.tasklistForm.reset();
          },
          (error) => {
            console.error('Erro ao criar TaskList:', error);
            alert('Erro ao criar TaskList: ' + JSON.stringify(error.error));
          }
        );
      }
    } else {
      alert('O nome da TaskList é obrigatório!');
    }
  }

  editTaskList(taskList: Tasklist): void {
    this.editingTaskList = { ...taskList };
    this.tasklistForm.patchValue({ name: taskList.title });
  }

  deleteTaskList(id: number): void {
    if (
      confirm(
        'Tem certeza que deseja excluir esta TaskList e todas as suas tarefas?'
      )
    ) {
      this.taskService.deleteTaskList(id).subscribe(
        () => {
          alert('TaskList excluída!');
          this.loadTaskLists();
          this.selectedTaskList = null;
        },
        (error) => {
          console.error('Erro ao excluir TaskList:', error);
          alert('Erro ao excluir TaskList.');
        }
      );
    }
  }

  selectTaskList(taskList: Tasklist): void {
    this.selectedTaskList = taskList;
    if (taskList.id) {
      this.taskService.getTasksByTaskList(taskList.id).subscribe(
        (tasks) => {
          this.selectedTaskList!.tasks = tasks;
        },
        (error) => {
          console.error('Erro ao carregar tarefas da TaskList:', error);
        }
      );
    }
  }

  onAddOrUpdateTask(): void {
    if (!this.selectedTaskList || !this.selectedTaskList.id) {
      alert('Selecione uma TaskList antes de adicionar tarefas.');
      return;
    }
    if (this.taskForm.valid) {
      const newTaskData: Task = {
        content: this.taskForm.value.description || '',
        priority: this.taskForm.value.priority || '',
        due_date: this.taskForm.value.deadline
          ? new Date(this.taskForm.value.deadline).toISOString()
          : undefined,
      };

      if (this.editingTask) {
        this.taskService
          .updateTask(
            this.selectedTaskList.id,
            this.editingTask.id!,
            newTaskData
          )
          .subscribe(
            () => {
              alert('Tarefa atualizada!');
              this.selectTaskList(this.selectedTaskList!);
              this.resetTaskForm();
            },
            (error) => {
              console.error('Erro ao atualizar tarefa:', error);
              alert('Erro ao atualizar tarefa: ' + JSON.stringify(error.error));
            }
          );
      } else {
        this.taskService
          .createTask(this.selectedTaskList.id, newTaskData)
          .subscribe(
            () => {
              alert('Tarefa criada!');
              this.selectTaskList(this.selectedTaskList!);
              this.taskForm.reset();
            },
            (error) => {
              console.error('Erro ao criar tarefa:', error);
              alert('Erro ao criar tarefa: ' + JSON.stringify(error.error));
            }
          );
      }
    } else {
      alert('O título da tarefa é obrigatório!');
    }
  }

  editTask(task: Task): void {
    this.editingTask = { ...task };
    this.taskForm.patchValue({
      description: task.content,
      priority: task.priority,
      deadline: task.due_date ? task.due_date.substring(0, 16) : '',
    });
  }

  deleteTask(taskId: number): void {
    if (!this.selectedTaskList || !this.selectedTaskList.id) return;
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskService.deleteTask(this.selectedTaskList.id, taskId).subscribe(
        () => {
          alert('Tarefa excluída!');
          this.selectTaskList(this.selectedTaskList!);
        },
        (error) => {
          console.error('Erro ao excluir tarefa:', error);
          alert('Erro ao excluir tarefa.');
        }
      );
    }
  }

  toggleComplete(task: Task): void {
    if (task.id && this.selectedTaskList && this.selectedTaskList.id) {
      const updatedTask: Task = { ...task, done: !task.done };
      this.taskService
        .updateTask(this.selectedTaskList.id, task.id, updatedTask)
        .subscribe(
          () => this.selectTaskList(this.selectedTaskList!),
          (error) => console.error('Erro ao alterar status:', error)
        );
    }
  }

  resetTaskListForm(): void {
    this.tasklistForm.reset();
    this.editingTaskList = null;
  }
  resetTaskForm(): void {
    this.taskForm.reset();
    this.editingTask = null;
  }
}
