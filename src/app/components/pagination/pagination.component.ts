import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { InputRestrictDirective } from '../../directives/input-restrict.directive';
import { Pagination } from '../../types/pagination';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-pagination',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    InputRestrictDirective,
  ],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnDestroy, OnChanges {
  pageNumber = new FormControl<string | number>('');
  pageOptions = [10, 15, 30, 60, 100, 300, 500];

  @Input() total: number = 0;
  @Input() limit: number = 100;
  @Input() page: number = 1;
  @Output() changed = new EventEmitter<Pagination>();

  private pageSub?: Subscription;

  ngOnInit() {
    this.pageSub = this.pageNumber.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((val) => {
        let inputValue = Number(val);
        if (isNaN(inputValue) || inputValue < 1) {
          inputValue = 1;
        }
        if (inputValue > this.pageCount) {
          inputValue = this.pageCount;
        }
        if (inputValue !== this.page) {
          this.setCurrentPage(inputValue);
        } else {
          this.pageNumber.setValue(inputValue, { emitEvent: false });
        }
      });
  }

  ngOnChanges() {
    this.pageNumber.setValue(this.page, { emitEvent: false });
    if (this.controlsDisabled) {
      this.pageNumber.disable();
    } else {
      this.pageNumber.enable();
    }
  }

  ngOnDestroy() {
    this.pageSub?.unsubscribe();
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.pageNumber.setValue(target.value);
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.total / this.limit));
  }

  get controlsDisabled(): boolean {
    return this.total === 0;
  }

  setCurrentPage(page: number) {
    this.pageNumber.setValue(page, { emitEvent: false });
    this.changed.emit({ page, limit: this.limit });
  }

  onPageInput() {
    let inputValue = Number(this.pageNumber.value);
    if (isNaN(inputValue) || inputValue < 1) {
      inputValue = 1;
    }
    if (inputValue > this.pageCount) {
      inputValue = this.pageCount;
    }
    this.setCurrentPage(inputValue);
  }

  goToFirstPage() {
    this.setCurrentPage(1);
  }

  goToPreviousPage() {
    const prev =
      Number(this.pageNumber.value) > 1 ? Number(this.pageNumber.value) - 1 : 1;
    this.setCurrentPage(prev);
  }

  goToNextPage() {
    const next =
      Number(this.pageNumber.value) < this.pageCount
        ? Number(this.pageNumber.value) + 1
        : this.pageCount;
    this.setCurrentPage(next);
  }

  goToLastPage() {
    this.setCurrentPage(this.pageCount);
  }

  onLimitChange(newLimit: number) {
    this.pageNumber.setValue(1);
    this.changed.emit({ page: 1, limit: newLimit });
  }
}
