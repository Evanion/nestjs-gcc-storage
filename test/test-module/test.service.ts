import { StorageService } from '../../src';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class TestService {
  constructor(private storage: StorageService) {}

  getFile() {
    return this.storage.get('test.txt');
  }
}
