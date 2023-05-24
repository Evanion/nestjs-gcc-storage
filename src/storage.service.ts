import { Observable } from 'rxjs';
import { Response } from 'teeny-request';
import { DownloadResponse, Storage } from '@google-cloud/storage';
import { SetMetadataResponse } from '@google-cloud/storage/build/src/nodejs-common';
import { Inject, Injectable } from '@nestjs/common';

import { StorageModuleOptions } from './interfaces/storage-module-options.interface';
import { StorageFile } from './types/storage-file';
import { MODULE_OPTIONS_TOKEN } from './storage.module-definition';
import { STORAGE_BUCKET } from './constants';

@Injectable()
export class StorageService {
  private readonly storage: Storage;
  private bucket: string;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    options: StorageModuleOptions /*, @Inject(STORAGE_BUCKET) bucket: string*/,
  ) {
    this.storage = new Storage({
      projectId: options.projectId,
      credentials: options.credentials,
    });
    this.bucket = /* bucket || */ options.bucket;
  }

  save(
    path: string,
    media: Buffer,
    metadata: { [key: string]: string }[],
  ): Observable<SetMetadataResponse> {
    const fileMeta = metadata.reduce(
      (obj, item) => Object.assign(obj, item),
      {},
    );
    const file = this.storage.bucket(this.bucket).file(path);

    const stream = file.createWriteStream();

    return new Observable<SetMetadataResponse>((subscriber) => {
      stream
        .on('error', (err) => {
          subscriber.error(err);
        })
        .on('finish', async () => {
          const result = await file.setMetadata({ metadata: fileMeta });
          subscriber.next(result);
          subscriber.complete();
        })
        .end(media);
    });
  }

  delete(path: string) {
    return new Observable<Response<any>>((subscriber) => {
      this.storage
        .bucket(this.bucket)
        .file(path)
        .delete()
        .then(([result]) => {
          subscriber.next(result);
          subscriber.complete();
        })
        .catch((err) => {
          subscriber.error(err);
        });
    });
  }

  get(path: string): Observable<StorageFile> {
    return new Observable<StorageFile>((subscriber) => {
      this.storage
        .bucket(this.bucket)
        .file(path)
        .getMetadata()
        .then(async ([metadata]) => {
          const [buffer]: DownloadResponse = await this.storage
            .bucket(this.bucket)
            .file(path)
            .download();

          const storageFile = new StorageFile();
          storageFile.buffer = buffer;
          storageFile.metadata = new Map<string, string>(
            Object.entries(metadata || {}),
          );
          storageFile.contentType = metadata.get('contentType');

          subscriber.next(storageFile);
          subscriber.complete();
        })
        .catch((err) => {
          subscriber.error(err);
        });
    });
  }
}
