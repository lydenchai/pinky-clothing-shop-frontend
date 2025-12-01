import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-site-info',
  imports: [TranslateModule],
  templateUrl: './site-info.component.html',
  styleUrls: ['./site-info.component.scss'],
})
export class SiteInfoComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
