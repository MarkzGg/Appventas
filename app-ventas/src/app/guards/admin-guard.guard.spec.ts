import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AdminGuard } from './admin-guard.guard';

describe('adminGuardGuard', () => {
  const executeGuard: CanActivateFn = (route, state) =>
      TestBed.runInInjectionContext(() => {
        const guard = TestBed.inject(AdminGuard);
        return guard.canActivate(route, state);
      });

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
