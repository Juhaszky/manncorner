import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('Should return false when no token is present', () => {
    localStorage.removeItem('jwtToken');
    expect(service.checkAuth()).toBeFalse();
  });

  it("Should return true when token is present", () => {
    localStorage.setItem('jwtToken', 'mockToken');
    expect(service.checkAuth()).toBeTrue();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
