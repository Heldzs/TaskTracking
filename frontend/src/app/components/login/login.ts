// src/app/components/login/login.component.ts
import { Component, EventEmitter, Output, inject } from '@angular/core'; // Adicionado 'inject'
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common'; // Para *ngIf
import { AuthService } from '../../services/auth.service'; // Ajuste o caminho do serviço

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  @Output() loggedIn = new EventEmitter<void>(); // Evento emitido quando o login é bem-sucedido

  // Usando a função inject() para obter a dependência
  authService = inject(AuthService);

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  // O construtor está vazio, pois as dependências são injetadas com inject()
  constructor() {}

  onRegister(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        (response) => {
          alert(response.message);
          this.registerForm.reset();
        },
        (error) => {
          console.error('Erro no registro:', error);
          alert(
            'Erro ao registrar: ' +
              (error.error.username
                ? error.error.username[0]
                : JSON.stringify(error.error))
          );
        }
      );
    } else {
      alert('Preencha todos os campos obrigatórios para registro.');
    }
  }

  onLogin(): void {
  if (this.loginForm.valid) {
    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        // Armazena os tokens no localStorage
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);

        alert('Login bem-sucedido!');
        this.loginForm.reset();
        this.loggedIn.emit(); // Emite o evento para o componente pai
      },
      (error) => {
        console.error('Erro no login:', error);
        alert('Erro no login: Usuário ou senha inválidos.');
      }
    );
  } else {
    alert('Preencha usuário e senha para login.');
  }
}

}
