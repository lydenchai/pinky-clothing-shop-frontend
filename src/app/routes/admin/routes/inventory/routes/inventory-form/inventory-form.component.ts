import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InventoryService } from '../../../../../../services/inventory.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
  ],
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss'],
})
export class InventoryFormComponent implements OnInit {
  inventoryForm: FormGroup;
  loading = false;
  error: string | null = null;
  isEditMode = false;
  itemId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.inventoryForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      location: [''],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.itemId = +id;
        this.fetchItem(this.itemId);
      }
    });
  }

  fetchItem(id: number) {
    this.loading = true;
    this.inventoryService.getById(id).subscribe({
      next: (item) => {
        this.inventoryForm.patchValue(item);
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load inventory item.';
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.inventoryForm.invalid) return;
    this.loading = true;
    const data = this.inventoryForm.value;
    if (this.isEditMode && this.itemId) {
      this.inventoryService.update(this.itemId, data).subscribe({
        next: () => this.router.navigate(['/admin/inventory']),
        error: (err) => {
          this.error =
            err?.error?.message || 'Failed to update inventory item.';
          this.loading = false;
        },
      });
    } else {
      this.inventoryService.create(data).subscribe({
        next: () => this.router.navigate(['/admin/inventory']),
        error: (err) => {
          this.error =
            err?.error?.message || 'Failed to create inventory item.';
          this.loading = false;
        },
      });
    }
  }
}
