import { DynamicModule, Global, Module } from '@nestjs/common';
import i18next, { InitOptions } from 'i18next';

import { getConfigToken, getTranslatorFunctionToken } from './helpers';
import { AsyncInitOptions } from './interfaces';
import { TranslatorService } from './service';

@Module({})
@Global()
export class TranslatorModule {
    static forRootAsync(options?: AsyncInitOptions): DynamicModule {
        const configProvider = {
            provide: getConfigToken(),
            ...options
        };

        const translatorProvider = {
            provide: getTranslatorFunctionToken(),
            inject: [getConfigToken()],
            useFactory: async (opts: InitOptions) => {
                // this allow us to apply middleware
                if (options.init !== undefined) {
                    options.init(i18next);
                }
                i18next.init({
                    whitelist: opts.resources ? Object.keys(opts.resources) : [],
                    resources: opts.resources,
                    fallbackLng: 'en-US',
                    lng: 'en-US',
                    ...opts
                });
                return i18next;
            }
        };

        const providers: any[] = [configProvider, translatorProvider, TranslatorService];

        return {
            module: TranslatorModule,
            providers: providers,
            exports: [configProvider, translatorProvider, TranslatorService]
        };
    }
}
