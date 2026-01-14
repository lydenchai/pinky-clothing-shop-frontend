import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { PaginationType } from '../../../core/types/pagination-type';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
  ],
})
export class Pagination implements OnInit {
  pageList: number[] = [];
  end: number = 0;
  last: number = 0;
  private _limit!: number;
  private _page: number = 0;
  private _total: number = 0;
  pageOptions = [10, 15, 30, 60, 100, 300, 500];

  constructor() {
    this._limit = this.pageOptions[0];
  }

  ngOnInit() {
    this.update();
  }

  @Input() set total(total: number) {
    this._total = total;
    if (this.total && this.page && this.limit) {
      this.update();
    }
  }

  get total(): number {
    return this._total;
  }

  @Input() set page(page: number) {
    this._page = page;
    this.update();
  }

  get page(): number {
    return this._page;
  }

  @Input() set limit(limit: number) {
    this._limit = limit;
    if (this.total && this.page && this.limit) {
      this.update();
    }
  }

  get limit(): number {
    return this._limit;
  }

  @Input('surround-button') surroundButton: number = 1;

  @Output() changed = new EventEmitter<PaginationType>();

  goTo(page: number) {
    this.changed.emit({
      page,
      limit: this.limit,
    });
    this._page = page;
    this.update();
  }

  update() {
    this.pageList = [];
    if (this.total === 0 || !this.page || !this.limit) return;

    this.last = Math.ceil(this.total / this.limit);

    const current = this.page;
    // Always show first page
    this.pageList.push(1);
    if (this.last <= 7) {
      // Show all pages if there are 7 or fewer
      for (let i = 2; i <= this.last; i++) {
        this.pageList.push(i);
      }
    } else if (current <= 4) {
      // Show first 4 pages then ellipsis and last page (patterns 1 and 2)
      for (let i = 2; i <= Math.min(4, this.last); i++) {
        this.pageList.push(i);
      }
      this.pageList.push(-1); // Ellipsis
      this.pageList.push(this.last);
    } else if (current >= this.last - 3) {
      // Show first page, ellipsis, then last 4 pages
      this.pageList.push(-1); // Ellipsis
      for (let i = this.last - 3; i <= this.last; i++) {
        this.pageList.push(i);
      }
    } else {
      this.pageList.push(-1); // First ellipsis
      this.pageList.push(current - 1);
      this.pageList.push(current);
      this.pageList.push(current + 1);
      this.pageList.push(-1); // Second ellipsis
      this.pageList.push(this.last);
    }
    // Remove any duplicate ellipsis that might occur
    this.pageList = this.pageList.filter((item, index, array) => {
      if (item === -1 && array[index - 1] === -1) return false;
      return true;
    });
  }
}
