import { TestBed } from '@angular/core/testing';

import { TeamMemberTimesheetService } from './team-member-timesheet.service';

describe('TeamMemberTimesheetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TeamMemberTimesheetService = TestBed.get(TeamMemberTimesheetService);
    expect(service).toBeTruthy();
  });
});
