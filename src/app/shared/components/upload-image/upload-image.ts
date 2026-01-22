import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-upload-image",
  imports: [TranslateModule],
  templateUrl: "./upload-image.html",
  styleUrls: ["./upload-image.scss"],
})
export class UploadImage {
  @Input() previewUrl: string | null = null;
  @Input() disabled: boolean = false;
  @Output() imageSelected = new EventEmitter<File | null>();
  dragOver = false;

  onFileChange(event: Event) {
    if (this.disabled) return;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    if (this.disabled) return;
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    if (this.disabled) return;
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    if (this.disabled) return;
    event.preventDefault();
    this.dragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  handleFile(file: File) {
    this.imageSelected.emit(file);
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
