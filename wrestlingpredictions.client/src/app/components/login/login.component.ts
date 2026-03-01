import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../models/authentication/login.model';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const request: Login = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }

    this.authService.login(request).subscribe({
      next: () => {
        location.reload();
      },
      error: () => {
        this.error = 'Login failed.';
      },
      complete: () => this.loading = false
    });

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}
