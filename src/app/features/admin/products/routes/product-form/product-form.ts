import { Component, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { ProductService } from "../../../../../core/services/product.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { PluralPipe } from "../../../../../shared/pipes/plural.pipe";
import { FieldContainer } from "../../../../../shared/components/field-container/field-container";
import { UploadImage } from "../../../../../shared/components/upload-image/upload-image";
import { SizeEnum } from "../../../../../core/types/enums/size.enum";
import { MatSelectModule } from "@angular/material/select";
import { CategoryEnum } from "../../../../../core/types/enums/category.enum";
import { ColorEnum } from "../../../../../core/types/enums/color.enum";
import { MatIconModule } from "@angular/material/icon";
import { DialogService } from "../../../../../core/services/dialog.service";
import { SubcategoryEnum } from "../../../../../core/types/enums/subcategory.enum";

@Component({
  selector: "app-product-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FieldContainer,
    PluralPipe,
    UploadImage,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: "./product-form.html",
  styleUrls: ["./product-form.scss"],
})
export class ProductForm implements OnInit {
  imageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  updateId = signal<string | null>(null);
  categories = Object.values(CategoryEnum);
  subcategories = Object.values(SubcategoryEnum);
  SizeEnum = Object.values(SizeEnum);
  ColorEnum = Object.values(ColorEnum);

  form = new FormGroup({
    code: new FormControl<string | null>(""),
    name: new FormControl<string | null>("", Validators.required),
    description: new FormControl<string | null>("", Validators.required),
    price: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(0),
    ]),
    category: new FormControl<string | null>("", Validators.required),
    subcategory: new FormControl<string | null>("", Validators.required),
    image: new FormControl<string | null>("", Validators.required),
    stock: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(0),
    ]),
    sizes: new FormControl<string[] | null>(null, Validators.required),
    colors: new FormControl<string[] | null>(null),
  });

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly translate: TranslateService,
    private readonly dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.updateId.set(id);
      if (id) {
        this.productService.getById(id).subscribe({
          next: (res) => {
            const product = res.data;
            this.form.patchValue({
              code: product.code,
              name: product.name,
              description: product.description,
              price: product.price,
              category: product.category,
              subcategory: product.subcategory,
              image: product.image,
              stock: product.stock,
              sizes: product.sizes,
              colors: product.colors,
            });
            this.imagePreviewUrl = product.image || null;
          },
        });
        this.form.controls.code.disable();
      }
    });
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value as any;
    const productData = {
      ...formValue,
      name: formValue.name,
      description: formValue.description,
      category: formValue.category,
      subcategory: formValue.subcategory,
      sizes: formValue.sizes,
      colors: formValue.colors,
    };

    const request$ = this.updateId()
      ? this.productService.updateById(this.updateId()!, productData)
      : this.productService.create(productData);

    request$.subscribe({
      next: () => {
        this.form.markAsPristine();
        this.dialogService
          .success(this.translate.instant("message.saved_successfully"))
          .then(() => {
            this.router.navigate(["/admin/products"]);
          });
      },
      error: () => {
        this.dialogService.success(
          this.translate.instant("message.save_failed"),
        );
      },
    });
  }

  onImageSelected(file: File | null) {
    this.imageFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        this.imagePreviewUrl = base64;
        this.form.patchValue({ image: base64 });
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreviewUrl = null;
      this.form.patchValue({ image: "" });
    }
  }
}
