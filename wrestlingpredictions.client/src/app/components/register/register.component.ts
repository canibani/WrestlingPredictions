import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Register } from '../../models/authentication/register.model';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthenticationService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const request: Register = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    }
   
    this.authService.register(request).subscribe({
      next: () => {
        // Option 1: Just show success
        console.log('Registration successful');

        //// Option 2 (recommended): Auto-login after register
        //this.authService.login(request).subscribe({
        //  next: () => {
        //    console.log('Auto login successful');
        //    // TODO: redirect to home or prediction page
        //  },
        //  error: () => {
        //    this.error = 'Registration succeeded but login failed.';
        //  },
        //  complete: () => this.loading = false
        //});
      },
      error: (err) => {
        this.loading = false;

        if (err.error && err.error.length) {
          // Identity returns validation errors array
          this.error = err.error[0].description;
        } else {
          this.error = 'Registration failed.';
        }
      }
    });

    console.log(this.registerForm.value);

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

}
