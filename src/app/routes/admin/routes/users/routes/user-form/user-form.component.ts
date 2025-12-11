import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../../../../services/user.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { RoleEnum } from '../../../../../../types/enums/role-enum';
import { User } from '../../../../../../types/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  submitted = false;
  backendError: string | null = null;
  isEditMode = false;
  userId: any;
  RoleEnum = RoleEnum;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      address: [''],
      role: [RoleEnum.user, Validators.required],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.userId = id;
        this.loadUser(Number(this.userId));
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
      }
    });
  }

  loadUser(id: number) {
    this.loading = true;
    this.userService.getById(String(id)).subscribe({
      next: (res) => {
        const user = res.data;
        if (user) {
          this.userForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            role: user.role,
          });
        }
        this.loading = false;
      },
      error: () => {
        this.backendError = 'Failed to load user.';
        this.loading = false;
      },
    });
  }

  onSubmit() {
    this.submitted = true;
    this.backendError = null;
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach((field) => {
        const control = this.userForm.get(field);
        if (control && control.invalid) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      return;
    }
    this.loading = true;
    const userData = { ...this.userForm.value };
    if (this.isEditMode && this.userId) {
      // Remove password if empty
      if (!userData.password) delete userData.password;
      this.userService.updateById(String(this.userId), userData).subscribe({
        next: () => {
          this.router.navigate(['/admin/users']);
        },
        error: (error: any) => {
          this.backendError = error?.error?.message || 'Failed to update user.';
          this.loading = false;
        },
      });
    } else {
      this.userService.create(userData).subscribe({
        next: () => {
          this.router.navigate(['/admin/users']);
        },
        error: (error: any) => {
          this.backendError = error?.error?.message || 'Failed to save user.';
          this.loading = false;
        },
      });
    }
  }
}
