import { TestBed } from '@angular/core/testing';

import { BuildingsService } from './buildings';

describe('BuildingsService', () => {
  let service: BuildingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
