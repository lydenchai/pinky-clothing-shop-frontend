import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../../types/inventory';

@Component({
  selector: 'app-inventory',
  imports: [],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  inventories: Inventory[] = [];
  loading = true;

  constructor() {}

  ngOnInit() {}
}
