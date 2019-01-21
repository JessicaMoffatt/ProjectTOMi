import { TestBed } from '@angular/core/testing';

import { TeamSidebarService } from './team-sidebar.service';

describe('TeamSidebarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TeamSidebarService = TestBed.get(TeamSidebarService);
    expect(service).toBeTruthy();
  });
});
