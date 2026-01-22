import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-not-found",
  imports: [RouterLink, TranslateModule, MatIconModule],
  templateUrl: "./not-found.html",
  styleUrl: "./not-found.scss",
})
export class NotFound {}
