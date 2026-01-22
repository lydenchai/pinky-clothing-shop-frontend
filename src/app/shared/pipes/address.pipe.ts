import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "address",
})
export class AddressPipe implements PipeTransform {
  transform(address: any): string {
    if (!address) return "";
    const parts = [
      address.house,
      address.street,
      address.village,
      address.commune,
      address.district,
      address.province,
      address.country,
    ].filter((part) => !!part && part.trim() !== "");
    return parts.join(", ");
  }
}
