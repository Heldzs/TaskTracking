import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';

import { TaskService } from '../../services/tasklistService';
import { AuthService } from '../../services/auth.service';
import { Tasklist, Task } from '../../interfaces/tasklist'; // Importa as interfaces atualizadas

@Component({
  selector: 'app-tasklist',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './tasklist.html',
  styleUrls: ['./tasklist.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasklistComponent implements OnInit {
  // Injeta os serviços necessários
  taskService = inject(TaskService);
  authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef); // Injeta ChangeDetectorRef para forçar a detecção de mudanças

  taskLists: Tasklist[] = []; // Array para armazenar as listas de tarefas
  selectedTaskList: Tasklist | null = null; // Lista de tarefas atualmente selecionada
  editingTask: Task | null = null; // Tarefa sendo editada
  editingTaskList: Tasklist | null = null; // Lista de tarefas sendo editada

  // Propriedades para exibir mensagens de feedback na UI
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Formulário para criar/editar TaskLists
  tasklistForm = new FormGroup({
    name: new FormControl('', Validators.required),
    // Nota: A interface Tasklist tem 'priority', 'done', 'due_date', 'created_at'.
    // Estes campos não estão no formulário atual de Tasklist. Se você precisar
    // que o usuário defina esses campos para uma Tasklist, adicione-os aqui
    // e no tasklist.html. Por enquanto, a lógica assume que o backend
    // os gerencia ou que não são inputáveis pelo usuário diretamente.
  });

  // Formulário para criar/editar Tarefas
  taskForm = new FormGroup({
    title: new FormControl('', Validators.required), // 'title' mapeia para 'content' na interface Task
    description: new FormControl(''), // Adicionado de volta, caso seja usado
    category: new FormControl(''), // Campo para a categoria da tarefa
    priority: new FormControl(''),
    deadline: new FormControl(''),
  });

  constructor() {}

  ngOnInit(): void {
    this.loadTaskLists(); // Carrega as listas de tarefas ao inicializar o componente
  }

  // Exibe uma mensagem de sucesso ou erro na UI por um tempo limitado
  showMessage(type: 'success' | 'error', message: string): void {
    if (type === 'success') {
      this.successMessage = message;
      this.errorMessage = null;
    } else {
      this.errorMessage = message;
      this.successMessage = null;
    }
    this.cdr.detectChanges(); // Força a detecção de mudanças para atualizar a UI
    // Oculta a mensagem após 3 segundos
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
      this.cdr.detectChanges(); // Força a detecção de mudanças para remover a mensagem
    }, 3000);
  }

  // Realiza o logout do usuário
  onLogout(): void {
    this.authService.logout();
    this.showMessage('success', 'Logout realizado com sucesso!');
    console.log('Logout realizado.');
  }

  // Carrega todas as listas de tarefas do serviço
  loadTaskLists(): void {
    this.taskService.getTaskLists().subscribe(
      (data) => {
        this.taskLists = data;
        this.cdr.detectChanges(); // Força a detecção de mudanças após carregar as tasklists
      },
      (error) => {
        this.showMessage('error', 'Erro ao carregar TaskLists.');
        console.error('Erro ao carregar TaskLists:', error);
      }
    );
  }

  // Adiciona ou atualiza uma TaskList
  onAddOrUpdateTaskList(): void {
    if (this.tasklistForm.valid) {
      const newTaskList: Tasklist = {
        title: this.tasklistForm.value.name || '',
      };
      if (this.editingTaskList) {
        // Atualiza uma TaskList existente
        this.taskService
          .updateTaskList(this.editingTaskList.id!, newTaskList)
          .subscribe(
            () => {
              this.showMessage('success', 'TaskList atualizada!');
              console.log('TaskList atualizada!');
              this.loadTaskLists();
              this.resetTaskListForm();
            },
            (error) => {
              this.showMessage('error', 'Erro ao atualizar TaskList.');
              console.error('Erro ao atualizar TaskList:', error);
            }
          );
      } else {
        // Cria uma nova TaskList
        this.taskService.createTaskList(newTaskList).subscribe(
          () => {
            this.showMessage('success', 'TaskList criada!');
            console.log('TaskList criada!');
            this.loadTaskLists();
            this.tasklistForm.reset();
          },
          (error) => {
            this.showMessage('error', 'Erro ao criar TaskList.');
            console.error('Erro ao criar TaskList:', error);
          }
        );
      }
    } else {
      this.showMessage('error', 'O nome da TaskList é obrigatório!');
      console.warn('O nome da TaskList é obrigatório!');
    }
  }

  // Preenche o formulário para editar uma TaskList
  editTaskList(taskList: Tasklist): void {
    this.editingTaskList = { ...taskList };
    this.tasklistForm.patchValue({ name: taskList.title });
  }

  // Exclui uma TaskList
  deleteTaskList(id: number): void {
    // Nota: Em um ambiente de produção, substitua este console.log por um modal de confirmação customizado.
    console.log(
      'Ação de exclusão de TaskList iniciada. Em um ambiente real, um modal de confirmação customizado seria exibido.'
    );

    this.taskService.deleteTaskList(id).subscribe(
      () => {
        this.showMessage('success', 'TaskList excluída!');
        console.log('TaskList excluída!');
        this.loadTaskLists();
        this.selectedTaskList = null;
        this.cdr.detectChanges();
      },
      (error) => {
        this.showMessage('error', 'Erro ao excluir TaskList.');
        console.error('Erro ao excluir TaskList:', error);
      }
    );
  }

  // Seleciona uma TaskList para exibir suas tarefas
  selectTaskList(taskList: Tasklist): void {
    this.selectedTaskList = { ...taskList }; // Cria uma nova referência para selectedTaskList
    if (taskList.id) {
      this.taskService.getTasksByTaskList(taskList.id).subscribe(
        (tasks) => {
          // Atribui um novo array de tarefas para garantir que o Angular detecte a mudança
          this.selectedTaskList = {
            ...this.selectedTaskList!,
            tasks: [...tasks],
          };
          this.cdr.detectChanges(); // Força a detecção de mudanças após atualizar as tarefas
        },
        (error) => {
          this.showMessage('error', 'Erro ao carregar tarefas da TaskList.');
          console.error('Erro ao carregar tarefas da TaskList:', error);
        }
      );
    }
  }

  // Adiciona ou atualiza uma Tarefa dentro da TaskList selecionada
  onAddOrUpdateTask(): void {
    console.log('onAddOrUpdateTask called!'); // Log para depuração

    this.errorMessage = null; // Limpa mensagens anteriores
    this.successMessage = null; // Limpa mensagens anteriores

    if (!this.selectedTaskList || !this.selectedTaskList.id) {
      this.showMessage(
        'error',
        'Selecione uma TaskList antes de adicionar tarefas.'
      );
      console.warn('Selecione uma TaskList antes de adicionar tarefas.');
      return;
    }

    if (this.taskForm.valid) {
      const newTaskData: Task = {
        content: this.taskForm.value.title || '',
        priority: this.taskForm.value.priority || '',
        // Converte a data para o formato ISO se houver um deadline
        due_date: this.taskForm.value.deadline
          ? new Date(this.taskForm.value.deadline).toISOString()
          : undefined,
        done: false, // Nova tarefa não está completa por padrão
        // created_at será definido pelo backend
      };

      if (this.editingTask) {
        // Atualiza uma tarefa existente
        this.taskService
          .updateTask(
            this.selectedTaskList.id,
            this.editingTask.id!,
            newTaskData
          )
          .subscribe(
            (updatedTask) => {
              this.showMessage('success', 'Tarefa atualizada com sucesso!');
              console.log('Tarefa atualizada!');
              // Atualiza a tarefa na lista localmente
              if (this.selectedTaskList && this.selectedTaskList.tasks) {
                const taskIndex = this.selectedTaskList.tasks.findIndex(
                  (t) => t.id === updatedTask.id
                );
                if (taskIndex > -1) {
                  const newTasks = [...this.selectedTaskList.tasks];
                  newTasks[taskIndex] = updatedTask;
                  this.selectedTaskList = {
                    ...this.selectedTaskList,
                    tasks: newTasks,
                  };
                  this.cdr.detectChanges();
                }
              }
              this.resetTaskForm();
            },
            (error) => {
              this.showMessage('error', 'Erro ao atualizar tarefa.');
              console.error('Erro ao atualizar tarefa:', error);
            }
          );
      } else {
        // Cria uma nova tarefa
        this.taskService
          .createTask(this.selectedTaskList.id, newTaskData)
          .subscribe(
            (createdTask) => {
              this.showMessage('success', 'Tarefa criada com sucesso!');
              console.log('Tarefa criada!');
              // Adiciona a nova tarefa à lista localmente
              if (this.selectedTaskList && this.selectedTaskList.tasks) {
                this.selectedTaskList = {
                  ...this.selectedTaskList,
                  tasks: [...this.selectedTaskList.tasks, createdTask],
                };
                this.cdr.detectChanges();
              }
              this.taskForm.reset();
            },
            (error) => {
              this.showMessage('error', 'Erro ao criar tarefa.');
              console.error('Erro ao criar tarefa:', error);
            }
          );
      }
    } else {
      this.showMessage('error', 'O título da tarefa é obrigatório!');
      console.warn('O título da tarefa é obrigatório!');
    }
  }

  // Preenche o formulário para editar uma Tarefa
  editTask(task: Task): void {
    this.editingTask = { ...task };
    this.taskForm.patchValue({
      title: task.content,
      // Garante que o formato do deadline seja compatível com datetime-local (yyyy-MM-ddTHH:mm)
      deadline: task.due_date
        ? new Date(task.due_date).toISOString().substring(0, 16)
        : '',
    });
  }

  // Exclui uma Tarefa
  deleteTask(taskId: number): void {
    if (!this.selectedTaskList || !this.selectedTaskList.id) return;
    // Nota: Em um ambiente de produção, substitua este console.log por um modal de confirmação customizado.
    console.log(
      'Ação de exclusão de Tarefa iniciada. Em um ambiente real, um modal de confirmação customizado seria exibido.'
    );

    this.taskService.deleteTask(this.selectedTaskList.id, taskId).subscribe(
      () => {
        this.showMessage('success', 'Tarefa excluída!');
        console.log('Tarefa excluída!');
        // Remove a tarefa da lista localmente
        if (this.selectedTaskList && this.selectedTaskList.tasks) {
          this.selectedTaskList = {
            ...this.selectedTaskList,
            tasks: this.selectedTaskList.tasks.filter((t) => t.id !== taskId),
          };
          this.cdr.detectChanges();
        }
      },
      (error) => {
        this.showMessage('error', 'Erro ao excluir tarefa.');
        console.error('Erro ao excluir tarefa:', error);
      }
    );
  }

  // Alterna o status 'completo' de uma tarefa
  toggleComplete(task: Task): void {
    if (task.id && this.selectedTaskList && this.selectedTaskList.id) {
      const updatedTask: Task = { ...task, done: !task.done };
      this.taskService
        .updateTask(this.selectedTaskList.id, task.id, updatedTask)
        .subscribe(
          () => {
            // Atualiza o array de tarefas localmente
            if (this.selectedTaskList && this.selectedTaskList.tasks) {
              const taskIndex = this.selectedTaskList.tasks.findIndex(
                (t) => t.id === task.id
              );
              if (taskIndex > -1) {
                const newTasks = [...this.selectedTaskList.tasks];
                newTasks[taskIndex] = updatedTask;
                this.selectedTaskList = {
                  ...this.selectedTaskList,
                  tasks: newTasks,
                };
                this.cdr.detectChanges();
              }
            }
          },
          (error) => {
            this.showMessage('error', 'Erro ao alterar status da tarefa.');
            console.error('Erro ao alterar status:', error);
          }
        );
    }
  }

  // Reseta o formulário de TaskList
  resetTaskListForm(): void {
    this.tasklistForm.reset();
    this.editingTaskList = null;
    this.cdr.detectChanges();
  }

  // Reseta o formulário de Tarefa
  resetTaskForm(): void {
    this.taskForm.reset();
    this.editingTask = null;
    this.cdr.detectChanges();
  }
}
