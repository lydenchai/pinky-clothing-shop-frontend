import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http";
import { authInterceptor } from "./core/interceptors/auth.interceptor";
import { routes } from "./app.routes";
import { provideTranslateService, TranslateLoader } from "@ngx-translate/core";
import {
  TranslateHttpLoader,
  TRANSLATE_HTTP_LOADER_CONFIG,
} from "@ngx-translate/http-loader";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { customBuildInfo } from "../custom-build-info";

const httpLoaderConfig = {
  prefix: "/i18n/",
  suffix: ".json?v=" + customBuildInfo.cacheKey,
};

const httpLoaderFactory = () => new TranslateHttpLoader();

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: TRANSLATE_HTTP_LOADER_CONFIG, useValue: httpLoaderConfig },
    provideTranslateService({
      fallbackLang: "en",
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    provideAnimationsAsync(),
  ],
};
