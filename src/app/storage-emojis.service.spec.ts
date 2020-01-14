import { TestBed } from '@angular/core/testing';

import { StorageEmojisService } from './storage-emojis.service';

describe('StorageEmojisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StorageEmojisService = TestBed.get(StorageEmojisService);
    expect(service).toBeTruthy();
  });
});
