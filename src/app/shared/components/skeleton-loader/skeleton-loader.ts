import { Component, Input } from "@angular/core";

@Component({
  selector: "app-skeleton-loader",
  templateUrl: "./skeleton-loader.html",
  styleUrl: "./skeleton-loader.scss",
})
export class SkeletonLoader {
  @Input() count = 3;
}
