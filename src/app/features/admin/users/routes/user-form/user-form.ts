import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { RoleEnum } from '../../../../../core/types/enums/role-enum';
import { UserService } from '../../../../../core/services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldContainer } from '../../../../../shared/components/field-container/field-container';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FieldContainer,
    MatSelectModule,
  ],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.scss'],
})
export class UserForm implements OnInit {
  loading = false;
  submitted = false;
  backendError: string | null = null;
  isEditMode = false;
  userId: any;
  RoleEnum = Object.values(RoleEnum);
  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    phone: new FormControl(''),
    address: new FormControl(''),
    role: new FormControl(RoleEnum.user, Validators.required),
  });

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        // this.isEditMode = true;
        // this.userId = id;
        // this.loadUser(Number(this.userId));
        // this.form.controls.password.clearValidators();
        // this.form.controls.password.updateValueAndValidity();
        this.userService.getById(String(id)).subscribe({
          next: (res) => {
            const user = res.data;
            console.log(res.data);

            if (user) {
              this.form.patchValue({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user?.role as any,
              });
            }
          },
          error: () => {
            this.backendError = 'Failed to load user.';
          },
        });
      }
    });
  }

  loadUser(id: number) {
    this.loading = true;
    this.userService.getById(String(id)).subscribe({
      next: (res) => {
        const user = res.data;
        if (user) {
          this.form.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user?.role as any,
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
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        if (control && control.invalid) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      return;
    }
    this.loading = true;
    const userData = { ...this.form.value } as any;
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
