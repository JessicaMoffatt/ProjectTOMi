import { TestBed } from '@angular/core/testing';

import { UserAccountSidebarService } from './user-account-sidebar-service';

describe('UserAccountSidebarServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserAccountSidebarService = TestBed.get(UserAccountSidebarService);
    expect(service).toBeTruthy();
  });
});
