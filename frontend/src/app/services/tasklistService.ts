// src/app/services/task.service.ts
import { Injectable, inject } from '@angular/core'; // Importa 'Injectable' e 'inject' do Angular core
import { HttpClient } from '@angular/common/http'; // Importa HttpClient para fazer requisições HTTP
import { Observable } from 'rxjs'; // Importa Observable do RxJS para lidar com operações assíncronas
import { Task, Tasklist } from '../interfaces/tasklist'; // Importa as interfaces Task e TaskList

/**
 * Serviço Angular para gerenciar as operações CRUD (Criar, Ler, Atualizar, Excluir)
 * para TaskLists e Tasks, interagindo com a API Django.
 *
 * Utiliza o padrão de injeção de dependências 'inject()' do Angular para o HttpClient.
 */
@Injectable({
  providedIn: 'root', // Indica que este serviço será fornecido no nível raiz da aplicação, tornando-o um singleton.
})
export class TaskService {
  // Define a URL base da API Django. Certifique-se de que esta URL corresponde ao seu backend.
  private apiUrl = 'http://127.0.0.1:8000/api/';

  // Injeta o HttpClient usando a função `inject()`. Esta é a maneira moderna de injetar serviços no Angular.
  // Equivale a ter `constructor(private http: HttpClient) {}` mas é mais concisa e pode ser usada fora do construtor.
  http = inject(HttpClient);

  // O construtor permanece vazio, pois as dependências são gerenciadas via `inject()`.
  constructor() {}

  /**
   * Métodos CRUD para TaskLists (Listas de Tarefas)
   */

  /**
   * Obtém todas as TaskLists do usuário autenticado.
   * @returns Um Observable de um array de objetos TaskList.
   */
  getTaskLists(): Observable<Tasklist[]> {
    // Faz uma requisição GET para o endpoint 'tasklists/'.
    return this.http.get<Tasklist[]>(`${this.apiUrl}tasklists/`);
  }

  /**
   * Cria uma nova Tasklist.
   * @param taskList O objeto Tasklist a ser criado. O ID será gerado pelo backend.
   * @returns Um Observable do objeto Tasklist criado, incluindo seu ID.
   */
  createTaskList(taskList: Tasklist): Observable<Tasklist> {
    // Faz uma requisição POST para o endpoint 'tasklists/' com os dados da nova Tasklist.
    return this.http.post<Tasklist>(`${this.apiUrl}tasklists/`, taskList);
  }

  /**
   * Atualiza uma Tasklist existente.
   * @param id O ID da Tasklist a ser atualizada.
   * @param taskList O objeto Tasklist com os dados atualizados.
   * @returns Um Observable do objeto Tasklist atualizado.
   */
  updateTaskList(id: number, taskList: Tasklist): Observable<Tasklist> {
    // Faz uma requisição PUT para o endpoint 'tasklists/{id}/' com os dados atualizados.
    return this.http.put<Tasklist>(`${this.apiUrl}tasklists/${id}/`, taskList);
  }

  /**
   * Exclui uma Tasklist.
   * @param id O ID da Tasklist a ser excluída.
   * @returns Um Observable da resposta da requisição de exclusão (geralmente vazio).
   */
  deleteTaskList(id: number): Observable<any> {
    // Faz uma requisição DELETE para o endpoint 'tasklists/{id}/'.
    return this.http.delete<any>(`${this.apiUrl}tasklists/${id}/`);
  }

  /**
   * Métodos CRUD para Tasks (Tarefas), aninhadas dentro de uma Tasklist.
   */

  /**
   * Obtém todas as Tasks associadas a uma Tasklist específica.
   * @param tasklistId O ID da Tasklist da qual as tarefas serão buscadas.
   * @returns Um Observable de um array de objetos Task.
   */
  getTasksByTaskList(tasklistId: number): Observable<Task[]> {
    // Faz uma requisição GET para o endpoint aninhado 'tasklists/{tasklistId}/tasks/'.
    return this.http.get<Task[]>(
      `${this.apiUrl}tasklists/${tasklistId}/tasks/`
    );
  }

  /**
   * Cria uma nova Task dentro de uma Tasklist específica.
   * @param tasklistId O ID da Tasklist à qual a nova tarefa será associada.
   * @param task O objeto Task a ser criado. O ID será gerado pelo backend.
   * @returns Um Observable do objeto Task criado.
   */
  createTask(tasklistId: number, task: Task): Observable<Task> {
    // Faz uma requisição POST para o endpoint aninhado 'tasklists/{tasklistId}/tasks/' com os dados da nova Task.
    return this.http.post<Task>(
      `${this.apiUrl}tasklists/${tasklistId}/tasks/`,
      task
    );
  }

  /**
   * Atualiza uma Task existente dentro de uma Tasklist específica.
   * @param tasklistId O ID da Tasklist à qual a tarefa pertence.
   * @param taskId O ID da Task a ser atualizada.
   * @param task O objeto Task com os dados atualizados.
   * @returns Um Observable do objeto Task atualizado.
   */
  updateTask(tasklistId: number, taskId: number, task: Task): Observable<Task> {
    // Faz uma requisição PUT para o endpoint aninhado 'tasklists/{tasklistId}/tasks/{taskId}/' com os dados atualizados.
    return this.http.put<Task>(
      `${this.apiUrl}tasklists/${tasklistId}/tasks/${taskId}/`,
      task
    );
  }

  /**
   * Exclui uma Task existente dentro de uma Tasklist específica.
   * @param tasklistId O ID da Tasklist à qual a tarefa pertence.
   * @param taskId O ID da Task a ser excluída.
   * @returns Um Observable da resposta da requisição de exclusão (geralmente vazio).
   */
  deleteTask(tasklistId: number, taskId: number): Observable<any> {
    // Faz uma requisição DELETE para o endpoint aninhado 'tasklists/{tasklistId}/tasks/{taskId}/'.
    return this.http.delete<any>(
      `${this.apiUrl}tasklists/${tasklistId}/tasks/${taskId}/`
    );
  }
}
