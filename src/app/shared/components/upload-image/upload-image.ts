import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  templateUrl: './upload-image.html',
  styleUrls: ['./upload-image.scss'],
})
export class UploadImage {
  @Input() previewUrl: string | null = null;
  @Input() disabled: boolean = false;
  @Output() imageSelected = new EventEmitter<File | null>();

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.imageSelected.emit(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.previewUrl = null;
    this.imageSelected.emit(null);
  }
}
