import { TestBed } from '@angular/core/testing';

import { Tasklist } from './tasklist';

describe('Tasklist', () => {
  let service: Tasklist;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tasklist);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
