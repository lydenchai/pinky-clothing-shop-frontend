import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../../types/inventory';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-inventory',
  imports: [TranslateModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  inventories: Inventory[] = [];

  constructor() {}

  ngOnInit() {}
}
