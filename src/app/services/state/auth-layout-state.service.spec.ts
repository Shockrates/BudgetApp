import { TestBed } from '@angular/core/testing';

import { AuthLayoutStateService } from './auth-layout-state.service';

describe('AuthLayoutStateService', () => {
  let service: AuthLayoutStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthLayoutStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
