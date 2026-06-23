import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authVerificationGuard } from './auth-verification-guard';

describe('authVerificationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authVerificationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
