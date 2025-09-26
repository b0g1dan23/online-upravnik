import { TestBed } from '@angular/core/testing';

import { Buildings } from './buildings';

describe('Buildings', () => {
  let service: Buildings;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Buildings);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
