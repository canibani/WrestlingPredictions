import { TestBed } from '@angular/core/testing';

import { AuthinceptorInterceptor } from './authinceptor.interceptor';

describe('AuthinceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthinceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthinceptorInterceptor = TestBed.inject(AuthinceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
