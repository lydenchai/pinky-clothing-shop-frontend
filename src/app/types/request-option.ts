import { DestroyRef } from "@angular/core";

export interface RequestOption{
  isLoading?: boolean;
  isAlertError?: boolean;
  destroyRef?: DestroyRef;
}
