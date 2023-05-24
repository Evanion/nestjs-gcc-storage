import { Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './storage.module-definition';
import { StorageService } from './storage.service';
import { StorageFeatureOptions } from './interfaces/storage-feature-options.interface';

@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule extends ConfigurableModuleClass {
  /**
   * This is currently not working
   * /
  static forFeature(options: StorageFeatureOptions) {
    return {
      module: StorageModule,
      providers: [
        {
          provide: STORAGE_BUCKET,
          useValue: options?.bucket,
        },
      ],
    };
  }*/
}
